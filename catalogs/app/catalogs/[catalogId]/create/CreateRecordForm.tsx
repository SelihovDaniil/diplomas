"use client";

import { createRecord } from "./actions";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";

import { useActionState, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const initialState = {
  message: "",
};

const CreateRecordForm = ({
  catalogId,
  categories,
}: {
  catalogId: string;
  categories: string[];
}) => {
  const [fileName, setFileName] = useState("");
  const [state, formAction, pending] = useActionState(
    createRecord,
    initialState
  );

  return (
    <Box sx={{ mt: 2 }}>
      <form action={formAction}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <input type="hidden" value={catalogId} name="catalogId" />
          <TextField name="name" label="Название" />
          <TextField name="description" label="Описание" />
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Категория</InputLabel>
            <Select
              name="category"
              defaultValue={categories[0]}
              labelId="category-select-label"
              label="Категория"
            >
              {categories.map((el) => (
                <MenuItem key={el} value={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            {fileName}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                name="image"
                type="file"
                onChange={(event) => {
                  const files = event.target.files;
                  if (!files?.length) return;
                  setFileName(files[0].name);
                }}
              />
            </Button>
          </div>
          {state.message && <Alert severity="error">{state.message}</Alert>}
          <Button
            loading={pending}
            sx={{ width: "fit-content" }}
            type="submit"
            variant="contained"
          >
            Создать
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateRecordForm;
