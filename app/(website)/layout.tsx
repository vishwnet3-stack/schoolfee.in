import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import Script from "next/script";
import { Toaster } from "sonner";
// import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BreadcrumbSchema from "./components/BreadcrumbSchema";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  weight: "400",
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://schoolfee.in"),
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
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="v12rk9ezq8wZwwXWaLRAcWjqZ4z7bjAmCbzaX7ZyfX0"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J9Z3SVGVX4"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J9Z3SVGVX4');
          `}
        </Script>

        {/* Breadcrumb schema (all non-home pages) */}
        <BreadcrumbSchema />
      </head>

      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <div className="print:hidden">
          <Header />
        </div>
        {children}
        <Toaster position="top-right" richColors closeButton />
        <div className="print:hidden">
          <Footer />
        </div>
      </body>
    </html>
  );
}
