import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreatePollForm from "./CreatePollForm";

const Create = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/api/auth/signin");

  return <CreatePollForm userId={session.user.id} />;
};

export default Create;
