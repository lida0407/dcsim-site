// DC Sim moved to rack-density.com/dc/ (Dali, 2026-10-15). This writes redirects/ — one page per old route with a canonical,
// meta refresh and location.replace to the same path on the new site, plus a 404 that forwards any other path (downloads, media).
// Run after `npm run build` (reads the routes from dist/). The Pages workflow publishes redirects/, not dist/.
import fs from "node:fs";
import path from "node:path";

const TARGET = "https://rack-density.com/dc/";
const routes = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === "index.html") routes.push(path.relative("dist", d).split(path.sep).join("/"));
  }
})("dist");

const page = (to) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>DC Sim has moved to rack-density.com/dc/</title>
<link rel="canonical" href="${to}"><meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
<style>body{font:16px/1.6 system-ui,sans-serif;background:#080a09;color:#e8ece9;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#22c55e}</style>
</head><body><p>DC Sim has moved: <a href="${to}">${to.replace(/^https:\/\//, "")}</a></p></body></html>
`;

fs.rmSync("redirects", { recursive: true, force: true });
for (const r of routes) {
  const dir = path.join("redirects", r);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(TARGET + (r ? `${r}/` : "")));
}
const fwd = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>DC Sim has moved to rack-density.com/dc/</title><meta name="robots" content="noindex">
<script>var p = location.pathname; p = p.indexOf("/dcsim-site/") === 0 ? p.slice(12) : p.slice(1); location.replace(${JSON.stringify(TARGET)} + p + location.search + location.hash)</script>
</head><body><p>DC Sim has moved: <a href="${TARGET}">rack-density.com/dc/</a></p></body></html>
`;
fs.writeFileSync("redirects/404.html", fwd);
fs.writeFileSync("redirects/robots.txt", "User-agent: *\nAllow: /\n");
fs.writeFileSync("redirects/llms.txt", `# DC Sim\n\nDC Sim has moved to ${TARGET} — see https://rack-density.com/llms.txt\n`);
fs.writeFileSync("redirects/.nojekyll", "");
console.log(`${routes.length} redirect pages + 404 forwarder → ${TARGET}`);
