import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const Service = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!service) throw notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl text-center">{service.name}</h1>
      <div className="w-full h-96 relative">
        <Image
          src={"/api/images/" + service.image}
          alt={service.name}
          fill
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <p>{service.description}</p>
      <p>Email для связи: {service.user.email}</p>
      <div>
        <Link
          className="bg-teal-700 text-white hover:bg-teal-600 active:bg-teal-500 px-4 py-2 rounded cursor-pointer"
          href={`/services/${id}/book`}
        >
          Заказать
        </Link>
      </div>
    </div>
  );
};

export default Service;
