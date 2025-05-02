import { prisma } from "@/lib/prisma";
import Link from "next/link";

const Home = async () => {
  const polls = await prisma.poll.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl mb-2">Последние опросы</h1>
      <ul className="flex flex-col gap-2 mt-4">
        {polls.map((el) => (
          <li key={el.id}>
            <Link
              className="px-4 py-2 bg-slate-200 block hover:bg-slate-300 active:bg-slate-400"
              href={`/polls/${el.id}`}
            >
              {el.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
