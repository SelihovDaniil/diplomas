"use server";

import { auth } from "@/auth";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import * as v from "valibot";

const PollSchema = v.object({
  name: v.string(),
  properties: v.array(v.object({ name: v.string(), dataType: v.string() })),
});

export const createCatalog = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/auth");

  const { name, properties } = await v.parseAsync(PollSchema, {
    name: formData.get("name"),
    properties: formData
      .getAll("properties")
      .map((el) => JSON.parse(el as string)),
  });

  await client.connect();
  const { insertedId } = await client
    .db("catalogs")
    .collection("catalogs")
    .insertOne({
      name,
      schema: properties,
      userId: new ObjectId(session.user.id),
    });
  await client.close();

  return redirect(`/catalogs/${insertedId}`);
};
