import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL, BASE_PATH } from "./site.config.mjs";

const base = BASE_PATH.endsWith("/") ? BASE_PATH : BASE_PATH + "/";

/** Prefix the base path to root-relative links written in Markdown ("/pricing/" -> "/dcsim-site/pricing/"). */
function rehypeBaseLinks() {
  const walk = (node) => {
    if (node.type === "element") {
      for (const attr of ["href", "src"]) {
        const v = node.properties?.[attr];
        if (typeof v === "string" && v.startsWith("/") && !v.startsWith("//") && !v.startsWith(base)) {
          node.properties[attr] = base + v.slice(1);
        }
      }
    }
    (node.children || []).forEach(walk);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: { rehypePlugins: [rehypeBaseLinks] },
  build: { inlineStylesheets: "always" },
});
