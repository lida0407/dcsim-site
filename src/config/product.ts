// Product constants. The product name may change: never hard-code it anywhere else.
import { SITE_URL, BASE_PATH } from "../../site.config.mjs";

export const PRODUCT_NAME = "DC Sim";
export const COMPANY = "Sensaka";
export const COMPANY_URL = "https://sensaka.com";
export const CONTACT_EMAIL = "da@mustardseedmt.com";
/** Public demo of the English build. null = not public yet; the site shows stills and offers a walkthrough. */
export const DEMO_URL: string | null = null;
export const TEMPLATE_VERSION = "1.1";
export const TEMPLATE_FILE = "downloads/dc-import-template.xlsx";
export const EXAMPLE_FILE = "downloads/demo-hall.xlsx";

export const SITE = { url: SITE_URL, base: BASE_PATH };

export const PRICES = {
  design: [
    { label: "up to 20 racks", price: 490 },
    { label: "up to 100 racks", price: 1490 },
    { label: "more than 100 racks", price: 3900 },
  ],
  monitorPerRack: 5,
  monitorMin: 49,
  partnerMargin: 30,
};

export const mailto = (subject: string, body = "") =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
