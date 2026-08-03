import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import AdminStudentsClient from "./AdminStudentsClient";

export default async function AdminStudentsPage() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/dashboard");
  }

  return <AdminStudentsClient adminName={admin.name} />;
}
