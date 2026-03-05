import { SchoolSidebar } from "../../components/dashboard/school-sidebar";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export default function SchoolDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolSidebar />
      <div className="lg:pl-64">
        <main className="py-6 px-4 lg:px-4">
          {children}
        </main>
      </div>
    </div>
  );
}
