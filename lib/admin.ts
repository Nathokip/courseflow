import { auth } from "./auth";
import prisma from "./prisma";

export async function getAdminUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      studentId: true,
    },
  });

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

