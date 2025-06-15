"use server";

import { auth } from "@/auth";
import { bucket, minio } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import * as v from "valibot";

const ServiceSchema = v.object({
  name: v.string(),
  description: v.string(),
  image: v.union([v.file(), v.undefined()]),
});

export const createService = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  const { name, description, image } = await v.parseAsync(ServiceSchema, {
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
  });

  if (!image) {
    await prisma.service.create({
      data: { name, description, userId: session.user.id },
    });
  } else {
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

    await prisma.service.create({
      data: { name, description, image: objectName, userId: session.user.id },
    });
  }

  return redirect("/dashboard/services");
};
