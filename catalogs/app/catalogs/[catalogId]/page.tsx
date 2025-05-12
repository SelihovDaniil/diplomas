import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import FiltersPanel from "./FiltersPanel";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

const Catalog = async ({
  params,
  searchParams,
}: {
  params: Promise<{ catalogId: string }>;
  searchParams: Promise<{ category?: string; name?: string }>;
}) => {
  const session = await auth();

  const { catalogId } = await params;
  const filters = await searchParams;

  await client.connect();

  const pipeline = [
    { $match: { _id: new ObjectId(catalogId) } },
    {
      $project: {
        name: 1,
        categories: 1,
        userId: 1,
        data: {
          $filter: {
            input: "$data",
            as: "item",
            cond: {
              $and: [
                ...(filters.name
                  ? [
                      {
                        $regexMatch: {
                          input: "$$item.name",
                          regex: filters.name,
                          options: "i",
                        },
                      },
                    ]
                  : []),
                ...(filters.category
                  ? [
                      {
                        $eq: ["$$item.category", filters.category],
                      },
                    ]
                  : []),
              ],
            },
          },
        },
      },
    },
  ];
  const catalog = await client
    .db("catalogs")
    .collection("catalogs")
    .aggregate(pipeline)
    .next();

  await client.close();

  if (!catalog) return notFound();

  const isOwner = session?.user?.id === catalog.userId.toString();
  return (
    <div>
      <h1>{catalog.name}</h1>
      <FiltersPanel categories={catalog.categories} />

      <Grid
        sx={{ mt: 4 }}
        container
        spacing={2}
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      >
        {catalog.data?.map((el: any) => (
          <Grid key={el._id.toString()} size={{ xs: 1 }}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea
                sx={{ height: "100%" }}
                LinkComponent={Link}
                href={`/catalogs/${catalogId}/${el._id.toString()}`}
              >
                <CardMedia
                  sx={{ height: 140 }}
                  image={`/api/images/${el.image}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {el.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {el.category}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {isOwner && (
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button LinkComponent={Link} href={`/catalogs/${catalogId}/create`}>
            Создать запись
          </Button>
          <Button
            LinkComponent={Link}
            color="error"
            href={`/catalogs/${catalogId}/delete`}
          >
            Удалить каталог
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Catalog;
