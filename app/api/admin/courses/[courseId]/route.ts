import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

type RouteContext = {
  params: Promise<{
    courseId: string;
  }>;
};

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

export async function PUT(request: Request, context: RouteContext) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = parseCoursePayload(body);
  if (!payload) {
    return NextResponse.json({ error: "Please complete all course fields." }, { status: 400 });
  }

  const existing = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      registrations: {
        select: { userId: true },
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  if (payload.capacity < existing.enrolled) {
    return NextResponse.json(
      {
        error: `Capacity cannot be below the current enrollment of ${existing.enrolled}.`,
      },
      { status: 400 }
    );
  }

  const duplicate = await prisma.course.findFirst({
    where: {
      code: payload.code,
      semester: payload.semester,
      NOT: { id: courseId },
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { error: "A course with this code already exists for the selected semester." },
      { status: 409 }
    );
  }

  const creditDelta = payload.credits - existing.credits;

  const updated = await prisma.$transaction(async (tx) => {
    const course = await tx.course.update({
      where: { id: courseId },
      data: payload,
    });

    if (creditDelta !== 0 && existing.registrations.length > 0) {
      await Promise.all(
        existing.registrations.map((registration) =>
          tx.user.update({
            where: { id: registration.userId },
            data:
              creditDelta > 0
                ? { registeredCredits: { increment: creditDelta } }
                : { registeredCredits: { decrement: Math.abs(creditDelta) } },
          })
        )
      );
    }

    return course;
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await context.params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      registrations: {
        select: { userId: true },
      },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    if (course.registrations.length > 0) {
      await Promise.all(
        course.registrations.map((registration) =>
          tx.user.update({
            where: { id: registration.userId },
            data: {
              registeredCredits: {
                decrement: course.credits,
              },
            },
          })
        )
      );
    }

    await tx.registration.deleteMany({
      where: { courseId },
    });

    await tx.cartItem.deleteMany({
      where: { courseId },
    });

    await tx.course.delete({
      where: { id: courseId },
    });
  });

  return NextResponse.json({ message: "Course deleted." });
}
