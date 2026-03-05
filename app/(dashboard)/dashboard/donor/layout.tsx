import DonorSidebar from "../../components/dashboard/donor-sidebar";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function DonorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DonorSidebar />
      <div className="lg:pl-64">
        <main className="py-6 px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
