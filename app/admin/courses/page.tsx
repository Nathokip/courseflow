import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import AdminCoursesClient from "./AdminCoursesClient";

export default async function AdminCoursesPage() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/dashboard");
  }

  return <AdminCoursesClient adminName={admin.name} />;
}
