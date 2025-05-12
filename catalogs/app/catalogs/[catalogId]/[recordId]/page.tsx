import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { renderElement } from "@/app/utils/dataTypes";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

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
      <Typography variant="h4">
        {catalog.name} - {record.name}
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: 400,
          position: "relative",
        }}
      >
        <Image
          style={{ objectFit: "contain" }}
          fill
          src={`/api/images/${record.image}`}
          alt={record.name}
        />
      </Box>
      <Typography variant="body1">Категория: {record.category}</Typography>
      <Typography variant="body2">{record.description}</Typography>

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
