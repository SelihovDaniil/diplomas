"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import * as v from "valibot";

const VoteSchema = v.object({
  pollId: v.string(),
  optionId: v.string(),
});

export const makeVote = async (formData: FormData) => {
  const session = await auth();
  if (!session?.user) return redirect("/auth");

  const { optionId, pollId } = await v.parseAsync(VoteSchema, {
    pollId: formData.get("pollId"),
    optionId: formData.get("optionId"),
  });

  const poll = await prisma.poll.findUnique({ where: { id: pollId } });
  if (!poll) throw notFound();

  const alreadyVoted = Boolean(
    await prisma.votes.findFirst({
      where: {
        userId: session.user.id,
        option: {
          pollId: pollId,
        },
      },
    })
  );
  const isPollFinish = Date.now() > new Date(poll.endsAt).getTime();
  if (alreadyVoted || isPollFinish) return;

  await prisma.votes.create({
    data: { userId: session.user.id, optionId },
  });

  revalidatePath(`/polls/${pollId}`);
};
