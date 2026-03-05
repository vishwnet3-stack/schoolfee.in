export default function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Schoolfee",
        "alternateName": "Schoolfee - Education Without Financial Stress",
        "url": "https://schoolfee.in/",
        "logo": "https://schoolfee.in/logo.jpg",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91 9355355233",
            "contactType": "customer support",
            "areaServed": "IN",
            "availableLanguage": ["en"],
        },
        "description":
            "Schoolfee is a collaborative initiative of Community Health Mission (CHM) providing interest-free school fee support to middle-class families.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "New Delhi",
            "addressCountry": "IN",
        },
        "sameAs": [
            "https://www.facebook.com/people/School-Fee/61586280328441/",
            "https://x.com/school__fee",
            "https://www.instagram.com/school_fee/",
            "https://www.linkedin.com/in/school-fee/",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
