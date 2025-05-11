import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreateCatalogForm from "./CreateCatalogForm";
import { Typography } from "@mui/material";

const Create = async () => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/auth");

  return (
    <div>
      <Typography variant="h4">Создание каталога</Typography>
      <CreateCatalogForm userId={session.user.id} />
    </div>
  );
};

export default Create;
