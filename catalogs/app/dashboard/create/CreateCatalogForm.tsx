"use client";

import { User } from "next-auth";
import { useActionState, useState } from "react";
import { createCatalog } from "./action";
import { dataTypes } from "@/app/utils/dataTypes";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const initialState = { error: "" };

const CreateCatalogForm = ({ userId }: { userId: User["id"] }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [state, formAction, pending] = useActionState(
    createCatalog,
    initialState
  );

  const addCategory: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!name || categories.includes(name)) return;
    setCategories((prev) => [...prev, name]);
    setName("");
  };

  const deleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((el) => el !== name));
  };

  return (
    <form action={formAction}>
      <TextField required label="Название Каталога" name="name" />
      <input name="userId" type="hidden" value={userId} />
      <Box sx={{ my: 2 }}>
        <Typography sx={{ mb: 1 }}>Доступные категории</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Название категории"
          />

          <Button onClick={addCategory}>Добавить</Button>
        </Box>
      </Box>
      {categories.length > 0 && (
        <List sx={{ maxWidth: 360 }}>
          {categories.map((el) => (
            <ListItem
              disablePadding
              key={el}
              secondaryAction={
                <IconButton
                  onClick={() => deleteCategory(el)}
                  edge="end"
                  aria-label="delete"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <input name={`categories`} type="hidden" value={el} />
              <ListItemText primary={el} />
            </ListItem>
          ))}
        </List>
      )}

      {state.error && <p>{state.error}</p>}
      <Button type="submit" variant="contained" loading={pending}>
        Создать
      </Button>
    </form>
  );
};

export default CreateCatalogForm;
