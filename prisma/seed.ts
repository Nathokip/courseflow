import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "alex.johnson@university.edu" },
    update: {},
    create: {
      email: "alex.johnson@university.edu",
      password,
      name: "Alex Johnson",
      studentId: "STU-2024-001",
      semester: "Spring 2025",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqxmkjWjxLc49aNJYtmynJQXsz8OvJUeRu8TWUiuw6Uy2Ho73Bro1tTb0GnUqcsWZxMjCKEzyoW4JxJ_4wfojI2R4WTNfJA4qJ9hwiW085JlBpSp8pA8HNjF-kvxV9p2IJcpLbYjuc47DWm2NSRIwQp41dJId79wNEruvsQOc55Q5Y9T5D0UI0RQMqITWKRy5cHqXeryqdUEWAjJSTzqAXxn2i-b8fpzQ4r2dFu698LmNxXetGl9Wm2A",
      registeredCredits: 14,
      maxCredits: 18,
      creditLimit: 18,
      registrationDeadline: "Mar 30, 2025",
    },
  });

  const coursesData = [
    {
      id: "c001",
      code: "CSC 201",
      name: "Data Structures",
      description:
        "Fundamental concepts of data structures including arrays, linked lists, stacks, queues, trees, and graphs.",
      credits: 3,
      instructor: "Dr. A. Smith",
      schedule: "Mon/Wed 10:00 AM",
      department: "Computer Science",
      semester: "Sem 1",
      enrolled: 28,
      capacity: 40,
      colorVariant: "secondary",
    },
    {
      id: "c002",
      code: "CSC 202",
      name: "Software Engineering I",
      description:
        "Introduction to software engineering principles, life cycle models, requirements engineering, and design patterns.",
      credits: 3,
      instructor: "Prof. B. Johnson",
      schedule: "Tue/Thu 1:00 PM",
      department: "Software Engineering",
      semester: "Sem 1",
      enrolled: 35,
      capacity: 35,
      colorVariant: "tertiary",
    },
    {
      id: "c003",
      code: "MAT 210",
      name: "Discrete Mathematics",
      description:
        "Logic, sets, relations, functions, combinatorics, and graph theory applied to computer science.",
      credits: 4,
      instructor: "Dr. C. Lee",
      schedule: "Mon/Wed 2:00 PM",
      department: "Mathematics",
      semester: "Sem 1",
      enrolled: 22,
      capacity: 50,
      colorVariant: "primary",
    },
    {
      id: "c004",
      code: "CSC 301",
      name: "Database Systems",
      description:
        "Relational algebra, SQL, database design, normalization, and an introduction to NoSQL databases.",
      credits: 3,
      instructor: "Dr. D. Williams",
      schedule: "Fri 9:00 AM",
      department: "Computer Science",
      semester: "Sem 2",
      enrolled: 18,
      capacity: 40,
      colorVariant: "error",
    },
    {
      id: "c005",
      code: "CSC 310",
      name: "Operating Systems",
      description:
        "Process management, memory management, file systems, and security in modern operating systems.",
      credits: 4,
      instructor: "Prof. E. Martinez",
      schedule: "Tue/Thu 10:00 AM",
      department: "Computer Science",
      semester: "Sem 2",
      enrolled: 30,
      capacity: 45,
      colorVariant: "secondary",
    },
    {
      id: "c006",
      code: "SWE 400",
      name: "Software Architecture",
      description:
        "Advanced software design, architectural patterns, microservices, and system scalability.",
      credits: 3,
      instructor: "Dr. F. Chen",
      schedule: "Mon 3:00 PM",
      department: "Software Engineering",
      semester: "Sem 2",
      enrolled: 20,
      capacity: 30,
      colorVariant: "tertiary",
    },
    {
      id: "c007",
      code: "CS 101",
      name: "Intro to Programming",
      description:
        "Fundamental concepts of procedural programming, algorithms, and data structures.",
      credits: 3,
      instructor: "Prof. G. Rivera",
      schedule: "Mon/Wed 10:00 AM",
      department: "Computer Science",
      semester: "Sem 1",
      enrolled: 45,
      capacity: 50,
      colorVariant: "primary",
    },
    {
      id: "c008",
      code: "MATH 201",
      name: "Calculus I",
      description: "Limits, continuity, derivatives, and applications of differentiation.",
      credits: 4,
      instructor: "Dr. H. Patel",
      schedule: "Tue/Thu 1:00 PM",
      department: "Mathematics",
      semester: "Sem 1",
      enrolled: 50,
      capacity: 50,
      colorVariant: "tertiary",
    },
    {
      id: "c009",
      code: "PHYS 105",
      name: "General Physics",
      description: "Mechanics, heat, and sound. Includes laboratory sessions.",
      credits: 4,
      instructor: "Dr. I. Nguyen",
      schedule: "Fri 9:00 AM",
      department: "Physics",
      semester: "Sem 1",
      enrolled: 20,
      capacity: 40,
      colorVariant: "primary",
    },
    {
      id: "r001",
      code: "CS101",
      name: "Introduction to Computer Science",
      description:
        "Fundamental concepts of programming and computer systems architecture.",
      credits: 4,
      instructor: "Dr. A. Smith",
      schedule: "Mon/Wed 9:00 AM",
      department: "Computer Science",
      semester: "Sem 1",
      enrolled: 40,
      capacity: 50,
      colorVariant: "primary",
    },
    {
      id: "r002",
      code: "MATH205",
      name: "Linear Algebra",
      description: "Vector spaces, linear transformations, matrices, and eigenvalues.",
      credits: 3,
      instructor: "Prof. B. Johnson",
      schedule: "Tue/Thu 11:00 AM",
      department: "Mathematics",
      semester: "Sem 1",
      enrolled: 30,
      capacity: 40,
      colorVariant: "secondary",
    },
    {
      id: "r003",
      code: "ENG102",
      name: "Academic Writing",
      description:
        "Advanced composition focusing on research methodology and critical analysis.",
      credits: 3,
      instructor: "Dr. C. Lee",
      schedule: "Wed/Fri 2:00 PM",
      department: "English",
      semester: "Sem 1",
      enrolled: 25,
      capacity: 35,
      colorVariant: "tertiary",
    },
    {
      id: "r004",
      code: "PHYS110",
      name: "General Physics I",
      description: "Classical mechanics, thermodynamics, and wave motion.",
      credits: 4,
      instructor: "Dr. D. Williams",
      schedule: "Mon/Wed/Fri 10:00 AM",
      department: "Physics",
      semester: "Sem 1",
      enrolled: 38,
      capacity: 45,
      colorVariant: "secondary",
    },
    {
      id: "rc001",
      code: "ENG 101",
      name: "Composition",
      description: "Academic writing fundamentals.",
      credits: 3,
      instructor: "Prof. K. Adams",
      schedule: "Mon 9:00 AM",
      department: "English",
      semester: "Sem 1",
      enrolled: 20,
      capacity: 30,
      colorVariant: "secondary",
    },
    {
      id: "rc002",
      code: "HIST 202",
      name: "World History",
      description: "Survey of world history from ancient civilisations to modern times.",
      credits: 3,
      instructor: "Prof. L. Brown",
      schedule: "Wed 11:00 AM",
      department: "History",
      semester: "Sem 2",
      enrolled: 15,
      capacity: 35,
      colorVariant: "tertiary",
    },
  ];

  for (const course of coursesData) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: course,
      create: course,
    });
  }

  const registrationsData = [
    { userId: user.id, courseId: "r001" },
    { userId: user.id, courseId: "r002" },
    { userId: user.id, courseId: "r003" },
    { userId: user.id, courseId: "r004" },
  ];

  for (const reg of registrationsData) {
    await prisma.registration.upsert({
      where: { userId_courseId: reg },
      update: {},
      create: reg,
    });
  }

  const cartData = [
    { userId: user.id, courseId: "rc001" },
    { userId: user.id, courseId: "rc002" },
  ];

  for (const ci of cartData) {
    await prisma.cartItem.upsert({
      where: { userId_courseId: ci },
      update: {},
      create: ci,
    });
  }

  const announcementsData = [
    {
      id: "a001",
      title: "Spring Registration Open",
      body: "Registration for the Spring 2025 semester is now open for all continuing students.",
      icon: "campaign",
      iconColor: "tertiary",
    },
    {
      id: "a002",
      title: "Career Fair Next Week",
      body: "Join us in the main hall next Tuesday for the annual engineering career fair.",
      icon: "event",
      iconColor: "secondary",
    },
    {
      id: "a003",
      title: "System Maintenance",
      body: "The portal will be down for scheduled maintenance on Sunday from 2 AM to 4 AM.",
      icon: "info",
      iconColor: "error",
    },
  ];

  for (const ann of announcementsData) {
    await prisma.announcement.upsert({
      where: { id: ann.id },
      update: ann,
      create: ann,
    });
  }

  console.log("Seed completed successfully");
  console.log(`  User: ${user.email} / password123`);
  console.log(`  Courses: ${coursesData.length}`);
  console.log(`  Registrations: ${registrationsData.length}`);
  console.log(`  Cart items: ${cartData.length}`);
  console.log(`  Announcements: ${announcementsData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
