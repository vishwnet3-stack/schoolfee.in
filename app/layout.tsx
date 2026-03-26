import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Schoolfee",
  icons: {
    icon: "/logo/schoolfee.webp",
    shortcut: "/logo/schoolfee.webp",
    apple: "/logo/schoolfee.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
