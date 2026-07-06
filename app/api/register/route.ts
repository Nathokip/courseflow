import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const totalCredits = cartItems.reduce((sum, ci) => sum + ci.course.credits, 0);
  const currentRegCredits = user.registeredCredits;
  if (currentRegCredits + totalCredits > user.creditLimit) {
    return NextResponse.json({ error: "Credit limit exceeded" }, { status: 400 });
  }

  const existingRegs = await prisma.registration.findMany({
    where: { userId },
  });
  const existingCourseIds = new Set(existingRegs.map((r) => r.courseId));

  for (const ci of cartItems) {
    if (existingCourseIds.has(ci.courseId)) {
      return NextResponse.json(
        { error: `Already registered for ${ci.course.name}` },
        { status: 409 }
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const ci of cartItems) {
      await tx.registration.create({
        data: { userId, courseId: ci.courseId },
      });

      await tx.course.update({
        where: { id: ci.courseId },
        data: { enrolled: { increment: 1 } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    await tx.user.update({
      where: { id: userId },
      data: { registeredCredits: { increment: totalCredits } },
    });
  });

  return NextResponse.json({ success: true, registeredCourses: cartItems.length });
}
