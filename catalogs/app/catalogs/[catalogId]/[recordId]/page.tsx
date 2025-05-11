import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { renderElement } from "@/app/utils/dataTypes";
import { Button, Typography } from "@mui/material";

const Record = async ({
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
          schema: 1,
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

  const record = catalog.data[0];

  const isOwner = session?.user?.id === catalog.userId.toString();

  return (
    <div>
      <Typography variant="h4">{catalog.name}</Typography>
      <ul>
        {Object.keys(record)
          .filter((key) => key !== "_id")
          .map((key) => (
            <li key={key}>
              <b>{key}: </b>
              {renderElement(catalog.schema, key, record[key])}
            </li>
          ))}
      </ul>

      {isOwner && (
        <Button
          color="error"
          variant="contained"
          LinkComponent={Link}
          href={`/catalogs/${catalogId}/${recordId}/delete`}
        >
          Удалить
        </Button>
      )}
    </div>
  );
};

export default Record;
