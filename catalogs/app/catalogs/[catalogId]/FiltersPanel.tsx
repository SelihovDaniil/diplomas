"use client";

import { Box, TextField, FormControlLabel, Switch } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const FiltersPanel = ({
  schema,
}: {
  schema: { name: string; dataType: string }[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = debounce(
    (key: string, value: string | boolean | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value !== null && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    1000
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {schema.map((el: any) => (
          <div key={el.name}>
            {el.dataType === "number" && (
              <TextField
                label={el.name}
                type="number"
                onChange={(e) => handleChange(el.name, e.target.value)}
                defaultValue={searchParams.get(el.name) || ""}
              />
            )}
            {el.dataType === "string" && (
              <TextField
                label={el.name}
                type="text"
                onChange={(e) => handleChange(el.name, e.target.value)}
                defaultValue={searchParams.get(el.name) || ""}
              />
            )}
            {el.dataType === "boolean" && (
              <FormControlLabel
                label={el.name}
                control={
                  <Switch
                    defaultChecked={searchParams.get(el.name) === "true"}
                    onChange={(e) => handleChange(el.name, e.target.checked)}
                  />
                }
              />
            )}
            {el.dataType === "date" && isClient && (
              <DateTimePicker
                label={el.name}
                format="DD.MM.YYYY HH:mm"
                defaultValue={
                  searchParams.get(el.name)
                    ? dayjs(searchParams.get(el.name))
                    : null
                }
                onChange={(value) => {
                  handleChange(el.name, value?.toDate().toISOString() || "");
                }}
              />
            )}
          </div>
        ))}
      </Box>
    </nav>
  );
};

export default FiltersPanel;
