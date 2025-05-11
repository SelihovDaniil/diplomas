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

type Property = {
  name: string;
  dataType: string;
};

const CreateCatalogForm = ({ userId }: { userId: User["id"] }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [name, setName] = useState("");
  const [dataType, setDataType] = useState<Property["dataType"]>("");
  const [state, formAction, pending] = useActionState(
    createCatalog,
    initialState
  );

  const addOption: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!name || properties.map((el) => el.name).includes(name)) return;
    setProperties((prev) => [...prev, { name, dataType }]);
    setName("");
    setDataType("string");
  };

  const deleteOption = (name: string) => {
    setProperties((prev) => prev.filter((el) => el.name !== name));
  };

  return (
    <form action={formAction}>
      <TextField required label="Название Каталога" name="name" />
      <input name="userId" type="hidden" value={userId} />
      <Box sx={{ my: 2 }}>
        <Typography sx={{ mb: 1 }}>Добавить поле</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Название поля"
          />
          <FormControl size="small" sx={{ minWidth: 132 }}>
            <InputLabel id="demo-simple-select-label">Тип данных</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Тип данных"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              {Object.keys(dataTypes).map((key) => (
                <MenuItem key={key} value={key}>
                  {dataTypes[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={addOption}>Добавить</Button>
        </Box>
      </Box>
      {properties.length > 0 && (
        <div>
          Поля:
          <List sx={{ maxWidth: 360 }}>
            {properties.map((el) => (
              <ListItem
                disablePadding
                key={el.name}
                secondaryAction={
                  <IconButton
                    onClick={() => deleteOption(el.name)}
                    edge="end"
                    aria-label="delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <input
                  name={`properties`}
                  type="hidden"
                  value={JSON.stringify({
                    name: el.name,
                    dataType: el.dataType,
                  })}
                />
                <ListItemText
                  primary={`${el.name}: ${dataTypes[el.dataType]}`}
                />
              </ListItem>
            ))}
          </List>
        </div>
      )}

      {state.error && <p>{state.error}</p>}
      <Button type="submit" variant="contained" loading={pending}>
        Создать
      </Button>
    </form>
  );
};

export default CreateCatalogForm;
