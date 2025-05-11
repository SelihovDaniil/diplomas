"use client";

import { useActionState } from "react";
import { credentialsSignIn } from "./action";
import {
  Alert,
  Box,
  Button,
  Container,
  Input,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const initialState = {
  message: "",
};

const Auth = () => {
  const [state, formAction, pending] = useActionState(
    credentialsSignIn,
    initialState
  );

  return (
    <Container maxWidth="sm" sx={{ my: 8 }}>
      <Paper>
        <form action={formAction}>
          <Box display="flex" flexDirection="column" gap={2} p={4}>
            <Typography variant="h3">Вход</Typography>
            <TextField required type="email" name="email" label="Email" />
            <TextField
              required
              type="password"
              name="password"
              label="Пароль"
            />
            {state.message && <Alert severity="error">{state.message}</Alert>}
            <Button type="submit" loading={pending} variant="contained">
              Войти
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
