"use client";

import { DollarSign, Edit3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../../components/PageHeader";

const feeStructures = [
  {
    school: "Delhi Public School",
    board: "CBSE",
    fees: [
      { class: "Class 1-5", tuition: 8500, development: 1200, activity: 800, total: 10500 },
      { class: "Class 6-8", tuition: 9500, development: 1400, activity: 1000, total: 11900 },
      { class: "Class 9-10", tuition: 11000, development: 1600, activity: 1200, total: 13800 },
      { class: "Class 11-12", tuition: 13000, development: 1800, activity: 1400, total: 16200 },
    ],
  },
  {
    school: "Sunrise Academy",
    board: "CBSE",
    fees: [
      { class: "Class 1-5", tuition: 7200, development: 1000, activity: 600, total: 8800 },
      { class: "Class 6-8", tuition: 8500, development: 1200, activity: 800, total: 10500 },
      { class: "Class 9-10", tuition: 9800, development: 1400, activity: 1000, total: 12200 },
      { class: "Class 11-12", tuition: 11500, development: 1600, activity: 1200, total: 14300 },
    ],
  },
];

export default function FeeStructurePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Fee Structure" description="Manage fee structures across all registered schools">
        <Button className="bg-[#00468E] hover:bg-[#003570] text-white h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Structure
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {feeStructures.map((fs) => (
          <Card key={fs.school} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">{fs.school}</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Board: {fs.board}</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Edit3 className="h-3.5 w-3.5" /> Edit Fees
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50/60 dark:bg-gray-800/30 border-y border-gray-100 dark:border-gray-800">
                      <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Class</th>
                      <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Tuition</th>
                      <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Development</th>
                      <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Activity</th>
                      <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Total/Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fs.fees.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-white text-sm">{row.class}</td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">₹{row.tuition.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">₹{row.development.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400 hidden sm:table-cell">₹{row.activity.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#00468E] dark:text-blue-400">₹{row.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}