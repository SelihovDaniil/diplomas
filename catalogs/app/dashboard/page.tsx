import { auth } from "@/auth";
import client from "@/lib/db";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  await client.connect();

  const catalogs = await client
    .db("catalogs")
    .collection("catalogs")
    .find({ userId: session.user.id })
    .toArray();

  await client.close();

  return (
    <div>
      <Typography variant="h4">Мои каталоги</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 2 }}>
        <Typography>Вы вошли как {session.user.email}</Typography>
        <SignOutButton />
      </Box>
      <Button
        sx={{ my: 2 }}
        LinkComponent={Link}
        variant="contained"
        href="/dashboard/create"
      >
        Создать каталог
      </Button>
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

export default Dashboard;
