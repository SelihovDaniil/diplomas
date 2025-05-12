"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import * as v from "valibot";

const PollSchema = v.object({
  name: v.string(),
  categories: v.array(v.string()),
});

export const createCatalog = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/auth");

  const { name, categories } = await v.parseAsync(PollSchema, {
    name: formData.get("name"),
    categories: formData.getAll("categories"),
  });

  await client.connect();
  const { insertedId } = await client
    .db("catalogs")
    .collection("catalogs")
    .insertOne({
      name,
      categories,
      userId: new ObjectId(session.user.id),
    });
  await client.close();

  return redirect(`/catalogs/${insertedId}`);
};
