import { SITE_URL, BASE_PATH } from "../../site.config.mjs";

const base = BASE_PATH.endsWith("/") ? BASE_PATH : BASE_PATH + "/";

/** Site-relative link with the base path, e.g. u("pricing/") -> "/dcsim-site/pricing/". */
export const u = (path = ""): string => {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return base + path.replace(/^\//, "");
};

/** Absolute URL, for canonical tags, sitemaps, JSON-LD and llms.txt. */
export const abs = (path = ""): string => SITE_URL.replace(/\/$/, "") + u(path);
