"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import * as v from "valibot";

const PollSchema = v.object({
  name: v.string(),
  endsAt: v.date(),
  userId: v.string(),
  options: v.array(v.string()),
});

export const createPoll = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return redirect("/auth");

  const { name, endsAt, userId, options } = await v.parseAsync(PollSchema, {
    name: formData.get("name"),
    endsAt: new Date(formData.get("endsAt") as string),
    userId: formData.get("userId"),
    options: formData.getAll("options"),
  });

  if (options.length < 2) return { error: "Нужно как минимум 2 варианта" };
  if (new Date(endsAt).getTime() < Date.now())
    return { error: "Нельзя создать опрос который закончится в прошлом" };

  const poll = await prisma.poll.create({
    data: {
      name,
      userId,
      endsAt,
      options: {
        create: options.map((el) => ({
          name: el,
        })),
      },
    },
  });

  return redirect(`/dashboard/polls/${poll.id}`);
};
