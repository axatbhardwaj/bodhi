"use server";

import prisma from "@repo/db/client";

export async function getName(userId: string) {
  const res = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      name: true,
    },
  });
  return res?.name;
}
