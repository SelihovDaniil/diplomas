import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { renderElement } from "@/app/utils/dataTypes";
import { deleteRecord } from "./action";
import { Button, Typography } from "@mui/material";

const Delete = async ({
  params,
}: {
  params: Promise<{ catalogId: string; recordId: string }>;
}) => {
  const session = await auth();

  const { catalogId, recordId } = await params;

  await client.connect();
  const catalog = await client
    .db("catalogs")
    .collection("catalogs")
    .findOne(
      { _id: new ObjectId(catalogId), "data._id": new ObjectId(recordId) },
      {
        projection: {
          name: 1,
          userId: 1,
          data: {
            $filter: {
              input: "$data",
              as: "item",
              cond: { $eq: ["$$item._id", new ObjectId(recordId)] },
            },
          },
        },
      }
    );
  await client.close();

  if (!catalog || !catalog.data.length) return notFound();
  if (session?.user?.id !== catalog.userId.toString()) return redirect("/auth");

  const record = catalog.data[0];

  return (
    <div>
      <Typography variant="h4">
        {catalog.name} - {record.name}
      </Typography>
      <p>Вы уверены что хоитите удалить эту запись?</p>
      <form action={deleteRecord}>
        <input type="hidden" defaultValue={catalogId} name="catalogId" />
        <input type="hidden" defaultValue={recordId} name="recordId" />
        <Button color="error" variant="contained" type="submit">
          Удалить
        </Button>
      </form>
    </div>
  );
};

export default Delete;
