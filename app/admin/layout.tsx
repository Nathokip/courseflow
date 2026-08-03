import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getAdminUser } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      <AdminSidebar adminName={admin.name} />
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{ marginLeft: "var(--spacing-sidebar_width)" }}
      >
        {children}
      </div>
    </div>
  );
}
