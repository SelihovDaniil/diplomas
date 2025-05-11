import { auth } from "@/auth";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

const Navigation = async () => {
  const session = await auth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link style={{ textDecoration: "none", color: "inherit" }} href="/">
            <Typography variant="h6">Каталоги</Typography>
          </Link>
        </Box>
        {session?.user ? (
          <Button href="/dashboard" LinkComponent={Link}>
            Аккаунт
          </Button>
        ) : (
          <Button href="/auth" LinkComponent={Link}>
            Вход
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
