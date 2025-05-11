"use client";

import type { Metadata } from "next";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const metadata: Metadata = {
  title: "Каталоги",
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const MUIThemeProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <ThemeProvider theme={darkTheme}>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <CssBaseline />
      {children}
    </LocalizationProvider>
  </ThemeProvider>
);

export default MUIThemeProvider;
