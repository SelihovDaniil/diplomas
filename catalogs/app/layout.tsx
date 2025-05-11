import type { Metadata } from "next";
import Navigation from "./Navigation";
import MUIThemeProvider from "./MUIThemeProvider";
import { Container } from "@mui/material";

export const metadata: Metadata = {
  title: "Каталоги",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="ru">
    <body>
      <MUIThemeProvider>
        <Navigation />
        <Container sx={{ my: 8 }}>{children}</Container>
      </MUIThemeProvider>
    </body>
  </html>
);

export default Layout;
