"use client";

import { usePathname } from "next/navigation";

export default function BreadcrumbSchema() {
    const pathname = usePathname();
    if (!pathname || pathname === "/") return null;

    const segments = pathname.split("/").filter(Boolean);

    const items = [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://schoolfee.in/",
        },
        ...segments.map((seg, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            item: `https://schoolfee.in/${segments.slice(0, i + 1).join("/")}`,
        })),
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items,
    };

    return (
        <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
