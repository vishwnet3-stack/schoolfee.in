import { Suspense } from "react";
import { generateSEO } from "@/lib/seo";
import ParentRegistrationPage from "./ParentRegistration";

export const metadata = generateSEO({
  title: "Parent Registration | Apply for School Fees Support - Schoolfee",
  description: "Register as a parent with Schoolfee to apply for structured, interest-free financial support and ensure uninterrupted education for your child.",
  keywords: ["Schoolfee Parent Registration", "School Fee Support Application", "Parent Sign Up Education Support"],
  image: "/logo.jpg",
});

export default function ParentRegistration() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00305F 0%, #00468E 50%, #0058B4 100%)" }}>
        <div className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <ParentRegistrationPage />
    </Suspense>
  );
}