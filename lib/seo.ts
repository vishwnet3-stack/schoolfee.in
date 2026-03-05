import type { Metadata } from "next";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
};

export function generateSEO({
  title,
  description,
  keywords = [],
  image = "/logo.jpg",
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: "./",
    },
    openGraph: {
      title,
      description,
      siteName: "Schoolfee",
      locale: "en_IN",
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: "Schoolfee" }],
    publisher: "Schoolfee",
  };
}