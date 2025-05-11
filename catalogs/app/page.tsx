import client from "@/lib/db";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";

const Home = async () => {
  await client.connect();

  const catalogs = await client
    .db("catalogs")
    .collection("catalogs")
    .find({})
    .toArray();

  await client.close();
  return (
    <div>
      <Typography variant="h4">Каталоги</Typography>
      <List>
        {catalogs.map((el) => (
          <ListItem disablePadding key={el._id.toString()}>
            <ListItemButton
              LinkComponent={Link}
              href={`/catalogs/${el._id.toString()}`}
            >
              <ListItemText primary={el.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Home;
