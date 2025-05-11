"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";

export const createRecord = async (
  catalogId: string,
  data: Record<string, any>
) => {
  const session = await auth();

  await client.connect();

  const catalog = await client
    .db("catalogs")
    .collection("catalogs")
    .findOne({ _id: new ObjectId(catalogId) }, { projection: { userId: 1 } });
  if (!catalog) return notFound();
  if (catalog.userId.toString() !== session?.user?.id) return redirect("/auth");

  await client
    .db("catalogs")
    .collection<{
      data: Record<string, any> & { _id: ObjectId }[];
    }>("catalogs")
    .updateOne(
      { _id: new ObjectId(catalogId) },
      {
        $push: {
          data: {
            _id: new ObjectId(),
            ...data,
          },
        },
      }
    );
  await client.close();
  return redirect(`/catalogs/${catalogId}`);
};
