import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function KpiCard({
  title,
  value,
  change,
  changePositive = true,
  icon: Icon,
  iconColor = "text-[#00468E]",
  iconBg = "bg-[#00468E]/10",
}: KpiCardProps) {
  return (
    <div className="bg-white dark:bg-[#0d1f3c] rounded-2xl shadow-sm border border-gray-100 dark:border-[#00468E]/20 p-5 hover:shadow-md dark:hover:shadow-[#00468E]/10 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 leading-tight">{value}</p>
          {change && (
            <p className={cn(
              "text-xs mt-1.5 font-medium flex items-center gap-1",
              changePositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
            )}>
              {changePositive ? (
                <TrendingUp className="h-3 w-3 shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 shrink-0" />
              )}
              <span>{change} from last month</span>
            </p>
          )}
        </div>
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
          iconBg
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}