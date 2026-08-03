import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import AdminAnnouncementsClient from "./AdminAnnouncementsClient";

export default async function AdminAnnouncementsPage() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/dashboard");
  }

  return <AdminAnnouncementsClient adminName={admin.name} />;
}
