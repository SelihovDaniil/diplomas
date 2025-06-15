import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/api/auth/signin");

  const polls = await prisma.poll.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex gap-2 items-center">
        <p>
          Вы вошли как <b>{session.user.email}</b>
        </p>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-500 px-4 py-2 rounded cursor-pointer">
            Выйти
          </button>
        </form>
      </div>
      <h1 className="text-2xl mb-2">Мои опросы</h1>
      <Link
        href="/dashboard/polls/create"
        className="block bg-amber-700 text-white hover:bg-amber-600 active:bg-amber-500 px-4 py-2 rounded cursor-pointer"
      >
        Создать опрос
      </Link>
      <ul className="flex flex-col gap-2 mt-4">
        {polls.map((el) => (
          <li key={el.id}>
            <Link
              className="px-4 py-2 bg-slate-200 block hover:bg-slate-300 active:bg-slate-400"
              href={`/dashboard/polls/${el.id}`}
            >
              {el.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
