import { Suspense } from "react";
import TeacherDigilockerCallbackClient from "./TeacherDigilockerCallbackClient";

export default function TeacherDigilockerCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <TeacherDigilockerCallbackClient />
    </Suspense>
  );
}