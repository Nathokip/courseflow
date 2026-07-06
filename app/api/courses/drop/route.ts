import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const registration = await prisma.registration.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: { course: true },
  });

  if (!registration) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.registration.delete({
      where: { userId_courseId: { userId, courseId } },
    }),
    prisma.course.update({
      where: { id: courseId },
      data: { enrolled: { decrement: 1 } },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { registeredCredits: { decrement: registration.course.credits } },
    }),
  ]);

  return NextResponse.json({ success: true });
}
