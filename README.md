# CourseFlow — Student Course Registration System

A frontend prototype for a university course registration portal built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**. All data is currently mocked — the app is fully functional as a UI/UX demo, ready for db and backend.

---

## Pages

| Route | Description |
|---|---|
| `/login` | Login screen with mock authentication |
| `/dashboard` | Overview — stats, quick actions, announcements |
| `/available-courses` | Browse and filter all available courses |
| `/register-courses` | Add courses to cart and confirm registration |
| `/my-courses` | View currently enrolled courses |
| `/drop-course` | Drop an enrolled course (with confirmation modal) |
| `/profile` | Student account info |

---

## Requirements

| Dependency | Version | Notes |
|---|---|---|
| Node.js | **18.x or higher** (20+ recommended) | JavaScript runtime |
| pnpm | **8.x or higher** | Package manager (used in this project) |

> npm or yarn will also work but pnpm is what the lockfile is generated with.

---

## Installation

### macOS

```bash
# 1. Install Node.js via Homebrew (skip if already installed)
brew install node

# 2. Install pnpm
npm install -g pnpm

# 3. Verify
node --version   # should be 18+
pnpm --version   # should be 8+
```

### Windows

```powershell
# 1. Install Node.js
#    Download the LTS installer from https://nodejs.org and run it
#    OR use winget:
winget install OpenJS.NodeJS.LTS

# 2. Install pnpm
npm install -g pnpm

# 3. Verify (in a new terminal)
node --version
pnpm --version
```

### Linux (Ubuntu / Debian)

```bash
# 1. Install Node.js via NodeSource (Node 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install pnpm
npm install -g pnpm

# 3. Verify
node --version
pnpm --version
```

### Linux (Arch / Manjaro)

```bash
sudo pacman -S nodejs npm
npm install -g pnpm
```

---

## Setup & Running

```bash
# 1. Clone or navigate to the project folder
cd courseflow

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app redirects to `/login` automatically.

**Login credentials (mock):** any email + any password will work — click Login and it takes you to the dashboard.

---

## Other Commands

```bash
# Production build (checks for errors)
pnpm build

# Run production build locally
pnpm start

# Lint
pnpm lint
```

---

## Project Structure

```
courseflow/
├── app/
│   ├── (app)/                  # Authenticated pages (with sidebar layout)
│   │   ├── dashboard/
│   │   ├── available-courses/
│   │   ├── register-courses/
│   │   ├── my-courses/
│   │   ├── drop-course/
│   │   ├── profile/
│   │   └── layout.tsx          # Shared sidebar layout
│   ├── login/                  # Login page (no sidebar)
│   ├── globals.css             # Design system tokens + base styles
│   ├── layout.tsx              # Root layout (fonts, theme provider)
│   └── page.tsx                # Redirects to /login
├── components/
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── TopBar.tsx              # Top header bar with dark mode toggle
└── lib/
    ├── mock-data.ts            # All mock data — replace with API calls later
    └── theme-context.tsx       # Light/dark mode context
```

---

## Replacing Mock Data

All data lives in `lib/mock-data.ts`. When the backend is ready, replace the exports with API calls — the components consume them as typed interfaces so swapping the source requires no component changes.

```ts
// Before (mock)
import { registeredCourses } from "@/lib/mock-data";

// After (real API)
const registeredCourses = await fetch("/api/courses/registered").then(r => r.json());
```

---

## Tech Stack

- **[Next.js 16](https://nextjs.org/)** — App Router, TypeScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling
- **[Inter](https://fonts.google.com/specimen/Inter)** — Font (via next/font)
- **[Material Symbols](https://fonts.google.com/icons)** — Icon set (Google Fonts)
