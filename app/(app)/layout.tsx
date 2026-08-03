import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect unauthenticated users to login
  if (!session?.user) {
    redirect("/login");
  }

  // Admins belong in the admin console, not the student portal
  const role = (session.user as { role?: string }).role;
  if (role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{ marginLeft: "var(--spacing-sidebar_width)" }}
      >
        {children}
      </div>
    </div>
  );
}
