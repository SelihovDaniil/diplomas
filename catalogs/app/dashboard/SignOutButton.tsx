"use client";

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

const SignOutButton = () => (
  <Button
    onClick={() => signOut()}
    size="small"
    color="error"
    variant="contained"
  >
    Выйти
  </Button>
);

export default SignOutButton;
