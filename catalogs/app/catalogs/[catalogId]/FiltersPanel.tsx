"use client";

import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

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

const FiltersPanel = ({ categories }: { categories: string[] }) => {
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

  return (
    <nav>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          sx={{ flexGrow: 1 }}
          label="Название"
          type="text"
          onChange={(e) => handleChange("name", e.target.value)}
          defaultValue={searchParams.get("name") || ""}
        />
        <Autocomplete
          disablePortal
          options={categories}
          defaultValue={searchParams.get("category") || ""}
          onChange={(e, newValue) => handleChange("category", newValue)}
          sx={{ flexBasis: 200 }}
          renderInput={(params) => <TextField {...params} label="Категория" />}
        />
      </Box>
    </nav>
  );
};

export default FiltersPanel;
