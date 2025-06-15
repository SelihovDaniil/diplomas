"use server";

import { auth } from "@/auth";
import { bucket, minio } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import * as v from "valibot";

const DeleteServiceSchema = v.object({
  id: v.string(),
});

export const deleteService = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  const { id } = await v.parseAsync(DeleteServiceSchema, {
    id: formData.get("id"),
  });

  const service = await prisma.service.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!service) throw notFound();

  if (service.image) {
    await minio.removeObject(bucket, service.image);
  }

  await prisma.service.delete({
    where: { id },
  });

  return redirect("/dashboard/services");
};
