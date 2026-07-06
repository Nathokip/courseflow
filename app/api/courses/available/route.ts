import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const semester = searchParams.get("semester");
  const search = searchParams.get("search");

  const where: any = {};

  if (department && department !== "All Courses") {
    if (department === "Semester 1") where.semester = "Sem 1";
    else if (department === "Semester 2") where.semester = "Sem 2";
    else where.department = department;
  }

  if (semester) where.semester = semester;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { instructor: { contains: search, mode: "insensitive" } },
    ];
  }

  const registrations = await prisma.registration.findMany({
    where: { userId: session.user.id },
    select: { courseId: true },
  });
  const registeredIds = new Set(registrations.map((r) => r.courseId));

  const courses = await prisma.course.findMany({ where, orderBy: { code: "asc" } });
  const result = courses.map((c) => ({
    ...c,
    registered: registeredIds.has(c.id),
  }));

  return NextResponse.json(result);
}
