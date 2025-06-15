"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";
import * as v from "valibot";

export const deleteCatalog = async (formData: FormData) => {
  const session = await auth();

  const { catalogId } = await v.parseAsync(
    v.object({ catalogId: v.string() }),
    { catalogId: formData.get("catalogId") }
  );

  await client.connect();

  const catalog = await client
    .db("catalogs")
    .collection("catalogs")
    .findOne({ _id: new ObjectId(catalogId) }, { projection: { userId: 1 } });

  if (!catalog) return notFound();
  if (catalog.userId.toString() !== session?.user?.id)
    return redirect("/api/auth/signin");

  await client
    .db("catalogs")
    .collection<{ _id: ObjectId }>("catalogs")
    .deleteOne({ _id: new ObjectId(catalogId) });

  await client.close();

  return redirect(`/dashboard`);
};
