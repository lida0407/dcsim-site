#!/usr/bin/env python3
"""One-off converter: marketing spec pages (dcsim-plan repo, marketing/dc-site) -> Astro content files.

Run once to seed src/content; the generated files are then edited by hand and are the source of truth.
Usage: python3 scripts/convert_specs.py ~/Sensaka/marketing/dc-site [only-substring]
"""
import json, re, sys
from pathlib import Path

SRC = Path(sys.argv[1]).expanduser()
OUT = Path(__file__).resolve().parent.parent / "src" / "content"

PAGES = {  # spec file -> (collection, id, section, order)
    "pages/product-overview.md": ("pages", "product", "product", 0),
    "pages/product-facility.md": ("pages", "product/facility", "product", 1),
    "pages/product-connectivity.md": ("pages", "product/connectivity", "product", 2),
    "pages/product-it.md": ("pages", "product/it", "product", 3),
    "pages/product-design.md": ("pages", "product/design", "product", 4),
    "pages/product-simulate.md": ("pages", "product/simulate", "product", 5),
    "pages/partners.md": ("pages", "partners", "company", 1),
    "pages/security.md": ("pages", "security", "company", 2),
    "pages/contact.md": ("pages", "contact", "company", 3),
    "pages/sample-twin.md": ("pages", "resources/sample-twin", "resources", 2),
    "pages/excel-template.md": ("pages", "resources/excel-template", "resources", 1),
    "integrations/zabbix.md": ("pages", "integrations/zabbix", "integrations", 1),
    "integrations/netbox.md": ("pages", "integrations/netbox", "integrations", 2),
    "integrations/grafana.md": ("pages", "integrations/grafana", "integrations", 3),
    "integrations/solarwinds.md": ("pages", "integrations/solarwinds", "integrations", 4),
    "integrations/manageengine-opmanager.md": ("pages", "integrations/manageengine-opmanager", "integrations", 5),
    "integrations/sunbird-dctrack.md": ("pages", "integrations/sunbird-dctrack", "integrations", 6),
    "integrations/prtg.md": ("pages", "integrations/prtg", "integrations", 7),
    "integrations/cloudsino.md": ("pages", "integrations/cloudsino", "integrations", 8),
    "weekly/guides/rack-power-capacity-planning.md": ("guides", "rack-power-capacity-planning", "guides", 1),
    "weekly/guides/ups-failure-impact-analysis.md": ("guides", "ups-failure-impact-analysis", "guides", 2),
    "weekly/guides/dcim-for-small-data-center.md": ("guides", "dcim-for-small-data-center", "guides", 3),
    "weekly/guides/tokens-per-kwh.md": ("guides", "tokens-per-kwh", "guides", 4),
}

DROP = re.compile(r"^(DirectAnswer|FAQ.*|PricingStrip.*|LeadMagnet.*|CTA|Screenshots|Footer note|Hero.*|Side column|Form|"
                  r"Section: Application form|Changelog rules|Calculators.*|Cards|Guides index.*|ScenarioClip row|"
                  r"Hero form.*|Section: Download the example)$", re.I)

LABELS = {
    "/product": "Product overview", "/product/facility": "Facility layers", "/product/connectivity": "Connectivity layers",
    "/product/it": "IT layers", "/product/design": "Design mode", "/product/simulate": "Simulate",
    "/integrations": "Integrations", "/partners": "Partner program", "/pricing": "Pricing", "/security": "Security & data",
    "/contact": "Contact", "/resources/excel-template": "the Excel template", "/resources/sample-twin": "the sample twin",
}


def link(m):
    path = m.group(1).rstrip(".,")
    key = path.split("#")[0].rstrip("/") or "/"
    label = LABELS.get(key, "more")
    href = path if path.endswith("/") or "#" in path else path + "/"
    return f"→ [{label}]({href})"


def parse(text):
    head, *rest = re.split(r"(?m)^## ", text)
    meta = {}
    for line in head.splitlines():
        m = re.match(r"^(URL|Title|Description|H1|StatusBadge|Schema|Interactive):\s*(.*)$", line)
        if m:
            meta[m.group(1)] = m.group(2).strip()
    sections = []
    for block in rest:
        title, _, body = block.partition("\n")
        sections.append((title.strip(), body.strip("\n")))
    return meta, sections


def faq_items(body):
    items = []
    for line in body.splitlines():
        m = re.match(r"^\*\*(.+?\?)\*\*\s*(.+)$", line.strip())
        if m:
            items.append({"q": m.group(1).strip(), "a": m.group(2).strip()})
    return items


def clean_body(sections):
    out = []
    for title, body in sections:
        if DROP.match(title):
            continue
        t = re.sub(r"^Section:\s*", "", title)
        t = re.sub(r"\s*\((?:cards|inline|interactive|\d+ steps|\d+ rows|honest list|grouped|ScenarioClip|available today)[^)]*\)\s*$", "", t, flags=re.I)
        lines = []
        for line in body.splitlines():
            s = line.strip()
            if s.startswith("(Screenshot") or s.startswith("_(StatusBadge") or s.startswith("[Calculator:"):
                continue
            line = re.sub(r"^_Keyword blocks? \([^)]*\):_\s*", "", line)
            line = re.sub(r"→ (/[a-z0-9\-/#]+)", link, line)
            lines.append(line)
        out.append(f"## {t}\n\n" + "\n".join(lines).strip())
    return "\n\n".join(out).strip() + "\n"


def badge(raw):
    r = (raw or "").lower()
    for key in ("partner", "partial", "roadmap", "early", "available"):
        if key in r:
            return key
    return None


def yaml_val(v):
    return json.dumps(v, ensure_ascii=False)


ONLY = sys.argv[2] if len(sys.argv) > 2 else None
for spec, (coll, pid, section, order) in PAGES.items():
    if ONLY and ONLY not in spec:
        continue
    p = SRC / spec
    if not p.exists():
        print("skip (missing):", spec)
        continue
    meta, sections = parse(p.read_text())
    direct = next((b for t, b in sections if t.startswith("DirectAnswer")), "").strip()
    faq = next((faq_items(b) for t, b in sections if t.startswith("FAQ")), [])
    fm = {
        "title": meta.get("Title", ""), "description": meta.get("Description", ""), "h1": meta.get("H1", ""),
        "directAnswer": " ".join(direct.split()), "section": section, "order": order, "faq": faq,
    }
    b = badge(meta.get("StatusBadge"))
    if b:
        fm["badge"] = b
        note = re.sub(r"^\*\*[^*]+\*\*\s*", "", meta.get("StatusBadge", "")).strip(" ()")
        if note:
            fm["badgeNote"] = note
    dest = OUT / coll / f"{pid}.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    front = "\n".join(f"{k}: {yaml_val(v)}" for k, v in fm.items())
    dest.write_text(f"---\n{front}\n---\n\n{clean_body(sections)}")
    print(f"{spec} -> {dest.relative_to(OUT.parent.parent)} ({len(faq)} FAQ)")
