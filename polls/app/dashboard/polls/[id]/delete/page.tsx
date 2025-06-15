import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { deletePoll } from "./action";

const Delete = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session?.user) return redirect("/auth");
  const { id } = await params;
  const deletePollWithId = deletePoll.bind(null, id);

  return (
    <div>
      <p className="text-xl">Подтвердите удаление опроса</p>
      <form action={deletePollWithId}>
        <button className="cursor-pointer mt-2 bg-red-500 px-4 py-2 w-fit text-white hover:bg-rose-600 active:bg-rose-700 transition">
          Удалить
        </button>
      </form>
    </div>
  );
};

export default Delete;
