import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

function parseCoursePayload(body: Record<string, unknown>) {
  const {
    code,
    name,
    description,
    credits,
    instructor,
    schedule,
    department,
    semester,
    capacity,
    colorVariant,
  } = body;

  if (
    typeof code !== "string" ||
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof instructor !== "string" ||
    typeof schedule !== "string" ||
    typeof department !== "string" ||
    typeof semester !== "string" ||
    typeof colorVariant !== "string"
  ) {
    return null;
  }

  const parsedCredits = Number(credits);
  const parsedCapacity = Number(capacity);

  if (
    !Number.isFinite(parsedCredits) ||
    !Number.isFinite(parsedCapacity) ||
    parsedCredits < 1 ||
    parsedCapacity < 0
  ) {
    return null;
  }

  return {
    code: code.trim(),
    name: name.trim(),
    description: description.trim(),
    credits: parsedCredits,
    instructor: instructor.trim(),
    schedule: schedule.trim(),
    department: department.trim(),
    semester: semester.trim(),
    capacity: parsedCapacity,
    colorVariant: colorVariant.trim() || "primary",
  };
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await prisma.course.findMany({
    orderBy: [{ semester: "asc" }, { code: "asc" }],
  });

  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = parseCoursePayload(body);
  if (!payload) {
    return NextResponse.json({ error: "Please complete all course fields." }, { status: 400 });
  }

  const existing = await prisma.course.findFirst({
    where: { code: payload.code, semester: payload.semester },
  });

  if (existing) {
    return NextResponse.json(
      { error: "A course with this code already exists for the selected semester." },
      { status: 409 }
    );
  }

  const course = await prisma.course.create({
    data: {
      ...payload,
      enrolled: 0,
    },
  });

  return NextResponse.json(course, { status: 201 });
}

