import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteService } from "./action";

const Delete = async ({ params }: { params: Promise<{ id: string }> }) => {
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
        Вы уверены что хотите удалить услугу <b>{service.name}</b>?
      </p>
      <div className="flex gap-2 mt-2">
        <Link
          className="bg-slate-700 text-white hover:bg-slate-600 active:bg-slate-500 px-4 py-2 rounded cursor-pointer"
          href={`/dashboard/services/${id}`}
        >
          Отмена
        </Link>
        <form action={deleteService}>
          <input type="hidden" name="id" value={id} />
          <button className="bg-red-700 text-white hover:bg-red-600 active:bg-red-500 px-4 py-2 rounded cursor-pointer">
            Удалить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Delete;
