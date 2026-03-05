"use client";

import { Search, Plus, MapPin, Users, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { mockManagers } from "../components/mock-data";

export default function ManagersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Managers" description={`${mockManagers.length} regional managers`}>
        <Button className="bg-[#00468E] hover:bg-[#003570] text-white h-9 gap-1.5">
          <Plus className="h-4 w-4" /> Add Manager
        </Button>
      </PageHeader>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search managers..." className="pl-9 h-9 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockManagers.map((manager) => (
          <Card key={manager.id} className="border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#00468E] to-[#F4951D]" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="font-bold text-sm bg-[#00468E] text-white">
                      {manager.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{manager.name}</p>
                    <p className="text-xs text-gray-500">{manager.email}</p>
                  </div>
                </div>
                <StatusBadge status={manager.status} />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5 text-[#F4951D]" />
                  {manager.region}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-3.5 w-3.5 text-[#00468E]" />
                  {manager.employees} employees
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <School className="h-3.5 w-3.5 text-emerald-500" />
                  {manager.schools} schools
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">View Profile</Button>
                <Button size="sm" className="flex-1 h-8 text-xs bg-[#00468E] hover:bg-[#003570] text-white">Activity</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}