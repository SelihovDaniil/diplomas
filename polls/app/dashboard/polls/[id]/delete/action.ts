"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const deletePoll = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  await prisma.poll.delete({ where: { id } });

  return redirect(`/dashboard`);
};
