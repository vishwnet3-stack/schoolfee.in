import { cn } from "@/lib/utils";

const statusConfig: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
  Inactive: { bg: "bg-gray-100 dark:bg-gray-700/40", text: "text-gray-600 dark:text-gray-400" },
  Pending: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400" },
  Paid: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
  Overdue: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
  Completed: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
  Failed: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
  Rejected: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400" },
  Approved: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
  Reviewed: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
};

const roleConfig: Record<string, { bg: string; text: string }> = {
  Admin: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
  Manager: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-400" },
  Employee: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
  "Normal User": { bg: "bg-gray-100 dark:bg-gray-700/40", text: "text-gray-600 dark:text-gray-400" },
  "Custom User": { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400" },
};

interface StatusBadgeProps {
  status: string;
  type?: "status" | "role";
}

export function StatusBadge({ status, type = "status" }: StatusBadgeProps) {
  const config =
    type === "role"
      ? roleConfig[status] || { bg: "bg-gray-100 dark:bg-gray-700/40", text: "text-gray-600 dark:text-gray-400" }
      : statusConfig[status] || { bg: "bg-gray-100 dark:bg-gray-700/40", text: "text-gray-600 dark:text-gray-400" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        config.bg,
        config.text
      )}
    >
      {status}
    </span>
  );
}