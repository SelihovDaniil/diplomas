import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const Order = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();

  if (!session?.user) return redirect("/auth");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!order) throw notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl text-center">{order.service.name}</h1>
      <div className="w-full h-96 relative">
        <Image
          src={"/api/images/" + order.service.image}
          alt={order.service.name}
          fill
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <p>{order.service.description}</p>
      <p>
        Время заказа: <b>{order.timestamp.toLocaleString("ru")}</b>
      </p>
      {order.comment && (
        <>
          <h4 className="text-xl font-bold">Комментарий к заказу:</h4>
          <p>{order.comment}</p>
        </>
      )}
    </div>
  );
};

export default Order;
