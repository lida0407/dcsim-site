import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { PRODUCT_NAME, COMPANY, CONTACT_EMAIL, PRICES, TEMPLATE_FILE, TEMPLATE_VERSION } from "../config/product";
import { abs } from "../lib/url";

// llms.txt (https://llmstxt.org): a plain summary of the site for answer engines.
export const GET: APIRoute = async () => {
  const pages = (await getCollection("pages")).sort((a, b) => a.data.section.localeCompare(b.data.section) || a.data.order - b.data.order);
  const guides = (await getCollection("guides")).sort((a, b) => a.data.order - b.data.order);
  const line = (title: string, path: string, desc: string) => `- [${title}](${abs(path)}): ${desc}`;
  const section = (name: string) =>
    pages.filter((p) => p.data.section === name).map((p) => line(p.data.h1, `${p.id}/`, p.data.description)).join("\n");

  const body = `# ${PRODUCT_NAME}

> ${PRODUCT_NAME} by ${COMPANY} is a browser-based data center simulator. One Excel file (racks, devices, power chain, cables) becomes a 3D twin with Floor, Air, Water, Fire, Power, Cabling, Network, Device and Token layers. Click any power, cooling or network node, press Fail, and see which racks go dark and which services stop. Thermal and runtime projections come from a zonal model and are labelled "estimated"; it is not CFD.

Status: the product runs today on demo data and on imported files, shown in walkthroughs. Zabbix and NetBox connect directly with a read-only token (tested against live demo instances); other live connectors, self-serve accounts, checkout and the AI design assistant are on the roadmap. Pricing: Design from $${PRICES.design[0].price} one-time per project; Monitor $${PRICES.monitorPerRack} per rack per month, minimum $${PRICES.monitorMin}; partners earn a ${PRICES.partnerMargin} % margin. Contact: ${CONTACT_EMAIL}.

## Main pages
${line("Home", "", "What DC Sim is, the three advantages, how it works.")}
${line("Pricing", "pricing/", "Design per project, Monitor per rack, Partner margin, comparison with typical DCIM pricing.")}
${line("Excel template v" + TEMPLATE_VERSION, TEMPLATE_FILE, "The import workbook: Devices required; Cables, Racks, Power, Networks, Cooling, Readings optional.")}

## Product
${section("product")}

## Integrations
${line("Integrations overview", "integrations/", "Status tool by tool; every tool works today through the template sheets.")}
${section("integrations")}

## Resources
${section("resources")}
${guides.map((g) => line(g.data.h1, `resources/guides/${g.id}/`, g.data.description)).join("\n")}
${line("Rack power calculator", "resources/calculators/rack-power/", "Load per PDU in normal and failover against the 80 % rule.")}
${line("Tokens per kWh calculator", "resources/calculators/tokens-per-kwh/", "Tokens per second and watts to tokens per kWh and cost per 1M tokens.")}

## Company
${section("company")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
