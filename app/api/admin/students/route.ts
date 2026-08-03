import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const students = await prisma.user.findMany({
    where: { role: "student" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      semester: true,
      registeredCredits: true,
      maxCredits: true,
      createdAt: true,
      registrations: {
        select: {
          id: true,
          createdAt: true,
          course: {
            select: {
              id: true,
              code: true,
              name: true,
              credits: true,
              instructor: true,
              semester: true,
              department: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json(students);
}
