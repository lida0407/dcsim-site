import { PRODUCT_NAME, COMPANY, PRICES } from "../config/product";
import { abs } from "./url";

export const faqLd = (items: { q: string; a: string }[]) =>
  items.length
    ? [{
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
      }]
    : [];

export const softwareLd = () => ({
  "@type": "SoftwareApplication",
  "@id": abs("#app"),
  name: PRODUCT_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web browser",
  description:
    "Browser-based data center simulator: one Excel file becomes a 3D twin with floor, air, water, fire, power, cabling, network, device and token layers, with fail-anything what-if.",
  publisher: { "@id": abs("#org") },
  offers: [
    { "@type": "Offer", name: "Monitor", price: PRICES.monitorMin, priceCurrency: "USD", description: `From $${PRICES.monitorPerRack} per rack per month, minimum $${PRICES.monitorMin}` },
    { "@type": "Offer", name: "Design", price: PRICES.design[0].price, priceCurrency: "USD", description: "One-time per project, from $490 for up to 20 racks" },
  ],
});

export const articleLd = (headline: string, description: string, path: string) => ({
  "@type": "Article",
  headline,
  description,
  mainEntityOfPage: abs(path),
  author: { "@type": "Organization", name: COMPANY },
  publisher: { "@id": abs("#org") },
});
