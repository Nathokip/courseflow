import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: "asc" },
  });

  const courses = registrations.map((r) => r.course);

  return NextResponse.json(courses);
}
