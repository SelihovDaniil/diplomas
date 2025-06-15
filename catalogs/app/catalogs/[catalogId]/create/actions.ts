"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { bucket, minio } from "@/lib/minio";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";
import * as v from "valibot";

const RecordSchema = v.object({
  catalogId: v.string(),
  name: v.string("Нужно указать название"),
  description: v.string("Нужно указать описание"),
  category: v.string("Выберите категорию"),
  image: v.pipe(
    v.file(),
    v.mimeType(
      ["image/jpeg", "image/png"],
      "Выберите картинку, поддерживается только png или jpg до  1МБ"
    )
  ),
});

export const createRecord = async (prevState: any, formData: FormData) => {
  const { success, output, issues } = await v.safeParseAsync(
    RecordSchema,
    Object.fromEntries(formData)
  );

  if (!success) {
    return { message: issues[0].message };
  }

  const session = await auth();

  await client.connect();

  const { catalogId, name, description, image, category } = output;

  const buffer = await image.arrayBuffer();
  const bufferData = Buffer.from(buffer);
  const objectName = `${Date.now()}-${image.name}`;

  const bucketExists = await minio.bucketExists(bucket);
  if (!bucketExists) {
    await minio.makeBucket(bucket);
  }

  await minio.putObject(bucket, objectName, bufferData, image.size, {
    "Content-Type": image.type,
    "Original-Filename": image.name,
  });

  const catalog = await client
    .db("catalogs")
    .collection("catalogs")
    .findOne({ _id: new ObjectId(catalogId) }, { projection: { userId: 1 } });
  if (!catalog) return notFound();
  if (catalog.userId.toString() !== session?.user?.id)
    return redirect("/api/auth/signin");

  await client
    .db("catalogs")
    .collection<{
      data: {
        _id: ObjectId;
        name: string;
        description: string;
        category: string;
        image: string;
      }[];
    }>("catalogs")
    .updateOne(
      { _id: new ObjectId(catalogId) },
      {
        $push: {
          data: {
            _id: new ObjectId(),
            name,
            description,
            category,
            image: objectName,
          },
        },
      }
    );
  await client.close();
  return redirect(`/catalogs/${catalogId}`);
};
