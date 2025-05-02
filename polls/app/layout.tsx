import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./Navigation";

export const metadata: Metadata = {
  title: "Опросы",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="ru">
    <body>
      <Navigation />
      <div className="max-w-4xl px-2 my-4 mx-auto">{children}</div>
    </body>
  </html>
);

export default Layout;
