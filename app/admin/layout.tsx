import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)]">
      <AdminSidebar />
      {/* Main content */}
      <main className="lg:pl-60">
        <div className="pt-14 lg:pt-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
