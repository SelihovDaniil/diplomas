import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import CreateRecordForm from "./CreateRecordForm";
import { Typography } from "@mui/material";

const Catalog = async ({
  params,
}: {
  params: Promise<{ catalogId: string }>;
}) => {
  const session = await auth();

  const { catalogId } = await params;

  await client.connect();
  const catalog = await client
    .db("catalogs")
    .collection("catalogs")
    .findOne(
      { _id: new ObjectId(catalogId) },
      { projection: { categories: 1, userId: 1 } }
    );
  await client.close();

  if (!catalog) return notFound();
  if (session?.user?.id !== catalog.userId.toString()) return redirect("/auth");

  return (
    <div>
      <Typography variant="h4">Создание записи</Typography>
      <CreateRecordForm catalogId={catalogId} categories={catalog.categories} />
    </div>
  );
};

export default Catalog;
