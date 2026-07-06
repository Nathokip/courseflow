import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: "asc" },
  });

  const courses = cartItems.map((ci) => ci.course);
  return NextResponse.json(courses);
}

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

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Course already in cart" }, { status: 409 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
  });
  const cartCredits = cartItems.reduce((sum, ci) => sum + ci.course.credits, 0);

  if (user && cartCredits + course.credits > user.creditLimit) {
    return NextResponse.json({ error: "Credit limit exceeded" }, { status: 400 });
  }

  await prisma.cartItem.create({
    data: { userId, courseId },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  await prisma.cartItem.deleteMany({
    where: { userId, courseId },
  });

  return NextResponse.json({ success: true });
}
