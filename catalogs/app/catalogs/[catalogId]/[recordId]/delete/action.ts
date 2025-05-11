"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";
import * as v from "valibot";

export const deleteRecord = async (formData: FormData) => {
  const session = await auth();

  const { catalogId, recordId } = await v.parseAsync(
    v.object({ catalogId: v.string(), recordId: v.string() }),
    { catalogId: formData.get("catalogId"), recordId: formData.get("recordId") }
  );
  await client.connect();

  const catalog = await client
    .db("catalogs")
    .collection("catalogs")
    .findOne({ _id: new ObjectId(catalogId) }, { projection: { userId: 1 } });

  if (!catalog) return notFound();
  if (catalog.userId.toString() !== session?.user?.id) return redirect("/auth");

  await client
    .db("catalogs")
    .collection<{ _id: ObjectId }>("catalogs")
    .updateOne(
      { _id: new ObjectId(catalogId) },
      { $pull: { data: { _id: new ObjectId(recordId) } } }
    );

  await client.close();

  return redirect(`/catalogs/${catalogId}`);
};
