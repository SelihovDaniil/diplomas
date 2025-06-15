import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { bookService } from "./action";

const Book = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();

  if (!session?.user) return redirect("/api/auth/signin");

  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!service) throw notFound();

  return (
    <div>
      <p>
        Вы уверены что хотите заказать услугу <b>{service.name}</b>?
      </p>

      <form action={bookService} className="flex flex-col">
        <input type="hidden" name="id" value={id} />
        <textarea
          className="border border-slate-400 p-2 rounded"
          name="comment"
          placeholder="Комментарий к заказу (опционально)"
        />
        <div className="flex gap-2 mt-2">
          <Link
            className="bg-slate-700 text-white hover:bg-slate-600 active:bg-slate-500 px-4 py-2 rounded cursor-pointer"
            href={`/services/${id}`}
          >
            Отмена
          </Link>
          <button className="bg-teal-700 text-white hover:bg-teal-600 active:bg-teal-500 px-4 py-2 rounded cursor-pointer">
            Заказть
          </button>
        </div>
      </form>
    </div>
  );
};

export default Book;
