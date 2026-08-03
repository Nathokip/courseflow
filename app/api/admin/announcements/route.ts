import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin";

function parseAnnouncementPayload(body: Record<string, unknown>) {
  const { title, body: message, icon, iconColor } = body;

  if (
    typeof title !== "string" ||
    typeof message !== "string" ||
    typeof icon !== "string" ||
    typeof iconColor !== "string"
  ) {
    return null;
  }

  return {
    title: title.trim(),
    body: message.trim(),
    icon: icon.trim(),
    iconColor: iconColor.trim(),
  };
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(announcements);
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

  const payload = parseAnnouncementPayload(body);
  if (!payload || !payload.title || !payload.body || !payload.icon || !payload.iconColor) {
    return NextResponse.json(
      { error: "Please complete all announcement fields." },
      { status: 400 }
    );
  }

  const announcement = await prisma.announcement.create({
    data: payload,
  });

  return NextResponse.json(announcement, { status: 201 });
}

