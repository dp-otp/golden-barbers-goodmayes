/* ============================================
   GOLDEN BARBERS - SEO & STRUCTURED DATA
   Local SEO optimization for Goodmayes, Ilford

   This file adds:
   - JSON-LD structured data for Google
   - Local business schema
   - Service schema
   - Review schema ready
   - Social media meta tags
   ============================================ */

// Business Data
const BUSINESS_SEO = {
    name: "Golden Barbers Goodmayes",
    description: "Premium barbershop in Goodmayes, Ilford. Expert fades, hot towel shaves, and traditional barbering. Book your appointment today.",
    url: "https://dp-otp.github.io/golden-barbers-goodmayes/premium/",
    logo: "https://dp-otp.github.io/golden-barbers-goodmayes/premium/pic.jpg",
    image: "https://dp-otp.github.io/golden-barbers-goodmayes/premium/pic.jpg",

    // Location
    address: {
        streetAddress: "123 High Street",
        addressLocality: "Goodmayes",
        addressRegion: "Ilford",
        postalCode: "IG3 8XY",
        addressCountry: "GB"
    },

    // Contact
    telephone: "+442012345678",
    email: "bookings@goldenbarbers.com",

    // Coordinates (REPLACE with real coordinates)
    geo: {
        latitude: "51.5631",
        longitude: "0.1092"
    },

    // Opening Hours
    openingHours: [
        "Mo-We 09:00-19:00",
        "Th-Fr 09:00-20:00",
        "Sa 08:00-18:00",
        "Su 10:00-16:00"
    ],

    // Price Range
    priceRange: "££",

    // Services
    services: [
        "Haircut",
        "Fade",
        "Skin Fade",
        "Beard Trim",
        "Hot Towel Shave",
        "Kids Haircut"
    ],

    // Social Media (REPLACE with real accounts)
    socialMedia: {
        instagram: "https://instagram.com/goldenbarbersgoodmayes",
        facebook: "https://facebook.com/goldenbarbersgoodmayes",
        tiktok: "https://tiktok.com/@goldenbarbers"
    }
};

// Generate Local Business Schema
function generateLocalBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "HairSalon",
        "name": BUSINESS_SEO.name,
        "description": BUSINESS_SEO.description,
        "image": BUSINESS_SEO.image,
        "logo": BUSINESS_SEO.logo,
        "url": BUSINESS_SEO.url,
        "telephone": BUSINESS_SEO.telephone,
        "email": BUSINESS_SEO.email,
        "priceRange": BUSINESS_SEO.priceRange,

        "address": {
            "@type": "PostalAddress",
            "streetAddress": BUSINESS_SEO.address.streetAddress,
            "addressLocality": BUSINESS_SEO.address.addressLocality,
            "addressRegion": BUSINESS_SEO.address.addressRegion,
            "postalCode": BUSINESS_SEO.address.postalCode,
            "addressCountry": BUSINESS_SEO.address.addressCountry
        },

        "geo": {
            "@type": "GeoCoordinates",
            "latitude": BUSINESS_SEO.geo.latitude,
            "longitude": BUSINESS_SEO.geo.longitude
        },

        "openingHoursSpecification": BUSINESS_SEO.openingHours.map(hours => ({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": hours.split(' ')[0],
            "opens": hours.split(' ')[1].split('-')[0],
            "closes": hours.split(' ')[1].split('-')[1]
        })),

        "sameAs": Object.values(BUSINESS_SEO.socialMedia),

        "areaServed": [
            "Goodmayes",
            "Ilford",
            "Seven Kings",
            "Chadwell Heath",
            "Barking",
            "Redbridge"
        ],

        "paymentAccepted": "Cash, Card, Contactless",
        "currenciesAccepted": "GBP"
    };
}

// Generate Service Schema
function generateServiceSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "Service",
                "name": "Men's Fade Haircut",
                "description": "Premium fade haircut by expert barbers",
                "provider": {
                    "@type": "HairSalon",
                    "name": BUSINESS_SEO.name
                },
                "areaServed": "Goodmayes, Ilford",
                "offers": {
                    "@type": "Offer",
                    "price": "25.00",
                    "priceCurrency": "GBP"
                }
            },
            {
                "@type": "Service",
                "name": "Hot Towel Shave",
                "description": "Traditional hot towel shave experience",
                "provider": {
                    "@type": "HairSalon",
                    "name": BUSINESS_SEO.name
                },
                "areaServed": "Goodmayes, Ilford",
                "offers": {
                    "@type": "Offer",
                    "price": "35.00",
                    "priceCurrency": "GBP"
                }
            },
            {
                "@type": "Service",
                "name": "Beard Trim",
                "description": "Professional beard grooming and trimming",
                "provider": {
                    "@type": "HairSalon",
                    "name": BUSINESS_SEO.name
                },
                "areaServed": "Goodmayes, Ilford",
                "offers": {
                    "@type": "Offer",
                    "price": "15.00",
                    "priceCurrency": "GBP"
                }
            }
        ]
    };
}

// Insert Schema into Page
function insertStructuredData() {
    // Local Business Schema
    const businessSchema = document.createElement('script');
    businessSchema.type = 'application/ld+json';
    businessSchema.textContent = JSON.stringify(generateLocalBusinessSchema());
    document.head.appendChild(businessSchema);

    // Service Schema
    const serviceSchema = document.createElement('script');
    serviceSchema.type = 'application/ld+json';
    serviceSchema.textContent = JSON.stringify(generateServiceSchema());
    document.head.appendChild(serviceSchema);

    console.log('✅ SEO Structured Data Added');
}

// Add Meta Tags
function addSEOMetaTags() {
    const metaTags = [
        // Basic SEO
        { name: 'description', content: BUSINESS_SEO.description },
        { name: 'keywords', content: 'barber goodmayes, haircut ilford, mens haircut goodmayes, fade goodmayes, barber shop ilford, hot towel shave goodmayes, beard trim ilford' },

        // Open Graph (Facebook, LinkedIn)
        { property: 'og:type', content: 'business.business' },
        { property: 'og:title', content: BUSINESS_SEO.name },
        { property: 'og:description', content: BUSINESS_SEO.description },
        { property: 'og:url', content: BUSINESS_SEO.url },
        { property: 'og:image', content: BUSINESS_SEO.image },
        { property: 'og:site_name', content: BUSINESS_SEO.name },
        { property: 'og:locale', content: 'en_GB' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: BUSINESS_SEO.name },
        { name: 'twitter:description', content: BUSINESS_SEO.description },
        { name: 'twitter:image', content: BUSINESS_SEO.image },

        // Mobile
        { name: 'theme-color', content: '#d4af37' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },

        // Location
        { name: 'geo.region', content: 'GB-ILF' },
        { name: 'geo.placename', content: 'Goodmayes, Ilford' },
        { name: 'geo.position', content: `${BUSINESS_SEO.geo.latitude};${BUSINESS_SEO.geo.longitude}` },
        { name: 'ICBM', content: `${BUSINESS_SEO.geo.latitude}, ${BUSINESS_SEO.geo.longitude}` }
    ];

    metaTags.forEach(tag => {
        const meta = document.createElement('meta');

        if (tag.name) {
            meta.setAttribute('name', tag.name);
        } else if (tag.property) {
            meta.setAttribute('property', tag.property);
        }

        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
    });

    console.log('✅ SEO Meta Tags Added');
}

// Initialize SEO
function initSEO() {
    insertStructuredData();
    addSEOMetaTags();
}

// Run when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSEO);
} else {
    initSEO();
}

/*
============================================
GOOGLE ANALYTICS SETUP
============================================

1. Create Google Analytics account at https://analytics.google.com
2. Get your Measurement ID (looks like G-XXXXXXXXXX)
3. Replace YOUR_MEASUREMENT_ID below
4. Uncomment the code

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_MEASUREMENT_ID');
</script>

============================================
GOOGLE SEARCH CONSOLE SETUP
============================================

1. Go to https://search.google.com/search-console
2. Add your property (GitHub Pages URL)
3. Verify ownership using HTML tag method
4. Add this to <head>:

<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />

============================================
GOOGLE MY BUSINESS
============================================

1. Create/claim your business at https://business.google.com
2. Verify your address
3. Add photos, hours, services
4. Get reviews from real customers
5. This boosts local SEO significantly

============================================
*/
