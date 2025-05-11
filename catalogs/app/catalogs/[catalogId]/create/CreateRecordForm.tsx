"use client";

import { Controller, useForm } from "react-hook-form";
import { createRecord } from "./actions";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { generateDefaultValues } from "@/app/utils/dataTypes";
import { useEffect, useState } from "react";

const CreateRecordForm = ({
  catalogId,
  schema,
}: {
  catalogId: string;
  schema: { name: string; dataType: string }[];
}) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: generateDefaultValues(schema),
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = (data: Record<string, any>) => {
    for (let el of schema) {
      if (el.dataType === "date") {
        data[el.name] = new Date(data[el.name]);
      }
      if (el.dataType === "number") {
        data[el.name] = Number(data[el.name]);
      }
    }
    createRecord(catalogId, data);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {schema.map((el: any) => (
            <div key={el.name}>
              {el.dataType === "number" && (
                <TextField
                  label={el.name}
                  type="number"
                  {...register(el.name, { required: true })}
                />
              )}
              {el.dataType === "string" && (
                <TextField
                  label={el.name}
                  type="text"
                  {...register(el.name, { required: true })}
                />
              )}
              {el.dataType === "boolean" && (
                <Controller
                  name={el.name}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControlLabel
                      label={el.name}
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                    />
                  )}
                />
              )}
              {el.dataType === "date" && isClient && (
                <Controller
                  control={control}
                  name={el.name}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DateTimePicker
                      format="DD.MM.YYYY HH:mm"
                      label={el.name}
                      value={field.value}
                      inputRef={field.ref}
                      onChange={field.onChange}
                    />
                  )}
                />
              )}
            </div>
          ))}
          <Button
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
