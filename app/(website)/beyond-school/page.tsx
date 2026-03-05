import { generateSEO } from "@/lib/seo";
import BeyondSchoolPage from "./BeyondSchoolPage";

export const metadata = generateSEO({
  title: "How Schoolfee Works | Interest-Free School Fee Support in India",
  description:
    "A simple, dignified platform connecting families, schools, and donors to cover school fees, with no complex procedures, no stigma, and zero interest.",
  keywords: [
    "Schoolfee process",
    "Parent education support",
    "Interest free school fees",
    "School fee support India",
    "Education finance support",
    "Zero interest repayment",
  ],
  image: "/logo.jpg",
});

export default function BeyondSchool() {
  return <BeyondSchoolPage />;
}
