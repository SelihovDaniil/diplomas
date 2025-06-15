"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import * as v from "valibot";

const BookServiceSchema = v.object({
  id: v.string(),
  comment: v.union([v.string(), v.undefined()]),
});

export const bookService = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  const { id, comment } = await v.parseAsync(BookServiceSchema, {
    id: formData.get("id"),
    comment: formData.get("comment"),
  });

  const service = await prisma.service.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!service) throw notFound();

  const order = await prisma.order.create({
    data: { serviceId: service.id, userId: session.user.id, comment },
  });

  return redirect("/dashboard/orders/" + order.id);
};
