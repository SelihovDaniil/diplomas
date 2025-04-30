import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const Orders = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/auth");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { service: true },
    orderBy: { timestamp: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-center">Мои заказы</h2>
      {orders.map((el) => (
        <Link
          key={el.id}
          href={"/dashboard/orders/" + el.id}
          className="p-2 shadow hover:bg-teal-100 active:bg-teal-200 transition"
        >
          <h5 className="text-xl text-center">{el.service.name}</h5>
          <p>
            Время: <b>{el.timestamp.toLocaleString("ru")}</b>
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Orders;
