import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Services = async () => {
  const session = await auth();

  if (!session?.user) return redirect("/auth");

  const services = await prisma.service.findMany({
    where: { userId: session.user.id },
  });

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard/services/create"
        className="text-white px-4 py-2 rounded bg-teal-700 hover:bg-teal-600 active:bg-teal-500"
      >
        Создать Услугу
      </Link>
      {services.map((el) => (
        <Link
          key={el.id}
          href={"/dashboard/services/" + el.id}
          className="p-2 shadow hover:bg-teal-100 active:bg-teal-200 transition"
        >
          <h5 className="text-xl text-center">{el.name}</h5>
          <div key={el.id} className="h-86 w-full relative mt-2">
            {el.image && (
              <Image
                src={"/api/images/" + el.image}
                alt={el.name}
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Services;
