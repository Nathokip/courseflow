# CourseFlow

CourseFlow is a university course registration portal built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, **Prisma**, **PostgreSQL**, and **NextAuth**.

The app includes:

- credential-based sign in and sign up
- a dashboard for student progress and announcements
- course browsing, registration, and drop flows
- Prisma-backed data models and seeded demo data

## Features

- `/login` and `/signup` authentication screens
- `/dashboard` student overview
- `/available-courses` course catalog with filters and search
- `/register-courses` registration cart and confirmation flow
- `/my-courses` enrolled course list
- `/drop-course` course drop flow with confirmation
- `/profile` student profile view

## Tech Stack

- **Next.js 16** - App Router, client and server components
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma** - database access and schema management
- **PostgreSQL** - persistent storage
- **NextAuth** - credentials authentication

## Requirements

- Node.js 20 or newer is recommended
- pnpm 8 or newer
- PostgreSQL 17 or compatible

## Setup

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Configure environment variables:

```bash
cp .env.example .env
```

The default local database URL points to the Postgres container started by Docker Compose:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/courseflow"
AUTH_SECRET="change-me-to-a-random-secret-in-production"
```

3. Install dependencies:

```bash
pnpm install
```

4. Push the Prisma schema and seed demo data:

```bash
pnpm db:push
pnpm db:seed
```

5. Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/login`.

## Demo Login

Seeded demo user:

- Email: `alex.johnson@university.edu`
- Password: `password123`

You can also create a new account from `/signup`.

## Scripts

```bash
pnpm dev         # Start the development server
pnpm build       # Build for production
pnpm start       # Run the production build
pnpm lint        # Run ESLint
pnpm db:generate # Generate Prisma Client
pnpm db:push     # Push schema changes to the database
pnpm db:migrate  # Create and apply a Prisma migration
pnpm db:seed     # Seed the database
pnpm db:studio   # Open Prisma Studio
```

## Project Structure

```text
courseflow/
├── app/
│   ├── (app)/                  # Authenticated pages and shared layout
│   │   ├── dashboard/
│   │   ├── available-courses/
│   │   ├── register-courses/
│   │   ├── my-courses/
│   │   ├── drop-course/
│   │   └── profile/
│   ├── api/                    # Route handlers for student, courses, auth, and cart flows
│   ├── login/
│   ├── signup/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Redirects to /login
├── components/
│   ├── SessionProvider.tsx
│   ├── Sidebar.tsx
│   └── TopBar.tsx
├── lib/
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── prisma.ts
│   ├── mock-data.ts
│   └── theme-context.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── docker-compose.yml
```

## Database

The Prisma schema defines:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Course`
- `Announcement`
- `Registration`
- `CartItem`

Seed data creates the demo student and sample courses/announcements used by the UI.

## Notes

- Mock data still exists in `lib/mock-data.ts` for parts of the UI that have not been wired to the database yet.
- The login page uses NextAuth credentials auth, and signup creates a local user through the app API route.
