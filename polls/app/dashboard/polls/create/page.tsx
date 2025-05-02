import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreatePollForm from "./CreatePollForm";

const Create = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/auth");

  return <CreatePollForm userId={session.user.id} />;
};

export default Create;
