import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
