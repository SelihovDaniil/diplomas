import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import client from "@/lib/db";
import { ObjectId } from "mongodb";
import { renderElement } from "@/app/utils/dataTypes";
import FiltersPanel from "./FiltersPanel";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

const Catalog = async ({
  params,
  searchParams,
}: {
  params: Promise<{ catalogId: string }>;
  searchParams: Promise<{ [k: string]: string }>;
}) => {
  const session = await auth();

  const { catalogId } = await params;
  const rawParams = await searchParams;

  await client.connect();
  const collection = await client.db("catalogs").collection("catalogs");

  const catalog = await collection.findOne(
    {
      _id: new ObjectId(catalogId),
    },
    { projection: { name: 1, _id: 1, schema: 1, userId: 1 } }
  );
  if (!catalog) return notFound();

  const filters: Record<string, any> = {};
  for (const field of catalog.schema) {
    const raw = rawParams[field.name];
    if (!raw) continue;

    switch (field.dataType) {
      case "string":
        filters[field.name] = raw;
        break;
      case "number":
        const num = Number(raw);
        if (!isNaN(num)) filters[field.name] = num;
        break;
      case "boolean":
        filters[field.name] = raw === "true";
        break;
      case "date":
        const date = new Date(raw);
        if (!isNaN(date.getTime())) filters[field.name] = date;
        break;
    }
  }

  const pipeline = [
    { $match: { _id: new ObjectId(catalogId) } },
    {
      $project: {
        data: {
          $filter: {
            input: "$data",
            as: "item",
            cond: {
              $and: Object.entries(filters).map(([key, value]) => ({
                $eq: [`$$item.${key}`, value],
              })),
            },
          },
        },
      },
    },
  ];

  const [filtered] = await collection.aggregate(pipeline).toArray();
  await client.close();

  if (!catalog) return notFound();

  const isOwner = session?.user?.id === catalog.userId.toString();
  return (
    <div>
      <h1>{catalog.name}</h1>
      <FiltersPanel schema={catalog.schema} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {catalog.schema.map((el: any) => (
                <TableCell align="center" key={el.name}>
                  {el.name}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.data?.map((record: any) => (
              <TableRow
                key={record._id.toString()}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {Object.keys(record)
                  .filter((el) => el !== "_id")
                  .map((key: any) => (
                    <TableCell align="center" key={key}>
                      {renderElement(catalog.schema, key, record[key])}
                    </TableCell>
                  ))}
                <TableCell align="center">
                  <IconButton
                    LinkComponent={Link}
                    href={`/catalogs/${catalogId}/${record._id.toString()}`}
                  >
                    <LaunchIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
