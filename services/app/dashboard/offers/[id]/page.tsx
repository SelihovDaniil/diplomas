import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

const Offer = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();

  if (!session?.user) return redirect("/api/auth/signin");

  const { id } = await params;

  const offer = await prisma.order.findUnique({
    where: { id },
    include: { service: true, user: true },
  });

  if (!offer) throw notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl text-center">{offer.service.name}</h1>
      <div className="w-full h-96 relative">
        <Image
          src={"/api/images/" + offer.service.image}
          alt={offer.service.name}
          fill
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <p>{offer.service.description}</p>
      <p>
        Время заказа: <b>{offer.timestamp.toLocaleString("ru")}</b>
      </p>
      <p>
        Email клиента: <b>{offer.user.email}</b>
      </p>
      {offer.comment && (
        <>
          <h4 className="text-xl font-bold">Комментарий к заказу:</h4>
          <p>{offer.comment}</p>
        </>
      )}
    </div>
  );
};

export default Offer;
