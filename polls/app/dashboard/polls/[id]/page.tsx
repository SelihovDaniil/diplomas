import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

const Poll = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  if (!session?.user) return redirect("/auth");

  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get("host");

  const poll = await prisma.poll.findUnique({
    where: { id },
    include: { options: { include: { _count: { select: { votes: true } } } } },
  });
  if (!poll) throw notFound();

  const pollUrl = `http://${host}/polls/${poll.id}`;
  const totalVotes = poll?.options.reduce(
    (acc, el) => acc + el._count.votes,
    0
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl text-center">{poll.name}</h1>
      <p>
        Всего голосов: <b>{totalVotes}</b>
      </p>
      <ul className="flex flex-col gap-2">
        {poll.options.map((el) => (
          <li
            className="bg-slate-300 px-4 py-2 flex justify-between relative"
            key={el.id}
          >
            <div
              style={{ width: (el._count.votes / totalVotes) * 100 + "%" }}
              className="z-1 h-full bg-slate-500 absolute top-0 left-0"
            />
            <span className="z-2 ">{el.name}</span>
            <b className="z-2">{el._count.votes}</b>
          </li>
        ))}
      </ul>
      <p>
        Ссылка на опрос:{" "}
        <Link className="text-blue-600 underline" href={pollUrl}>
          {pollUrl}
        </Link>
      </p>
    </div>
  );
};

export default Poll;
