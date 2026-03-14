// app/(website)/digilocker-callback/page.tsx
import { Suspense } from "react";
import DigilockerCallbackClient from "./DigilockerCallbackClient";

export const metadata = {
  title: "Digilocker Verification | Schoolfee",
  description: "Completing Digilocker identity verification",
};

export default function DigilockerCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <DigilockerCallbackClient />
    </Suspense>
  );
}