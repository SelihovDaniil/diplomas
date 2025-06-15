import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { deleteCatalog } from "./action";
import { Button, Typography } from "@mui/material";

const Delete = async ({
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
      {
        projection: {
          name: 1,
          userId: 1,
        },
      }
    );
  await client.close();

  if (!catalog) return notFound();
  if (session?.user?.id !== catalog.userId.toString())
    return redirect("/api/auth/signin");

  return (
    <div>
      <Typography>
        Вы уверены что хоитите удалить каталог <b>{catalog.name}</b>?
      </Typography>
      <form action={deleteCatalog}>
        <input type="hidden" defaultValue={catalogId} name="catalogId" />
        <Button type="submit" color="error" variant="contained" sx={{ mt: 1 }}>
          Удалить
        </Button>
      </form>
    </div>
  );
};

export default Delete;
