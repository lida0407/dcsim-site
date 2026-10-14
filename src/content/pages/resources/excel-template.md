---
title: "Free data center Excel template: racks, devices, power, cables"
description: "One file, seven sheets, only Devices required. Import it for a 3D twin with power, phase, cooling, cabling and network checks. Version 1.1."
h1: "The Excel template that becomes a 3D twin"
navLabel: "Excel template"
directAnswer: "The DC Sim template is one Excel workbook with seven sheets: Devices, Cables, Racks, Power, Networks, Cooling and Readings. Only Devices is required: rack, U position and model per row. Each extra sheet unlocks another layer of the twin. Import it and you get the room in 3D plus a check list of overlaps, overloads and single points of failure."
section: "resources"
order: 1
ctaTop: true
faq: [{"q": "Can I use CSV instead?", "a": "Yes: one CSV per sheet with the same columns; the importer reads comma, semicolon and tab separators."}, {"q": "What if my spreadsheet uses different column names?", "a": "Common synonyms are recognised; anything else can be renamed in the header row. The order of the columns does not matter."}, {"q": "Do I need all seven sheets?", "a": "No. Devices alone gives you the 3D room and rack power; add sheets as you have the data."}, {"q": "Is my file stored?", "a": "The import runs on the server, reads values only and builds your model. Ask us to delete the model and the file and we confirm within 30 days. See Security & data."}, {"q": "Does the template change?", "a": "Sheet and column names are a fixed contract shared with the homelab edition. New optional columns may be added, as in version 1.1; existing ones are never renamed."}]
---

## What each sheet unlocks

| Sheet | Required columns | Optional columns | Unlocks |
|---|---|---|---|
| **Devices** (required) | rack, u, model | name, role, height_u, power_cords (A/B/AB), serial, owner, warranty_end, runs | 3D racks, weight, power and heat per rack, airflow, open any device, warranty flags |
| Cables | from_device, to_device, type | from_port, to_port, phase, media, speed, length_m, color, label, vlan, route | Cabling view with trace, Power and Network diagrams, port checks |
| Racks | rack, row, position | height_u, width_in, front_faces (A/B), max_kw | the real room layout, hot and cold aisles, rack budgets |
| Power | name, type, rating | fed_from, feed, rack, voltage, phases, phase, runtime_min, battery_kwh, model | "what if feed A, a UPS or a breaker fails", overload checks |
| Networks | vlan, name | purpose, subnet | VLAN colours in the Network view |
| Cooling | name, type | capacity_kw, serves, model | cooling against heat, "what if AC-1 stops" |
| Readings | time, item, metric, value | | the model fitted to your real room; any monitoring tool's CSV export fits here |

## New in version 1.1

Additions only, so 1.0 files still import:

- **Cables:** `phase` (L1, L2, L3) on power cables.
- **Power:** `phase`, plus `runtime_min` and `battery_kwh` on UPS rows; the `type` column accepts `wall outlet`.
- **Racks:** `width_in` (19 by default, 10 for mini racks).

What they do: phases give a per-phase load and a phase-balance check on every three-phase node (80 % per phase, imbalance above 15 % flagged); `runtime_min` or `battery_kwh` set the UPS runtime ahead of the catalog value; `width_in` = 10 draws a mini rack (also inferred from a name like "Mini rack 2").

**Devices without a U:** a row with an empty `u` is kept as a device outside a rack; its `rack` value becomes the location, shown as an open shelf (for example a switch on the NOC desk). It is never skipped.

## What happens at import

1. Headers are matched case-insensitively, with synonyms ("U position", "Rack name", "Hostname", "Model number").
2. Model text is matched to the device catalog (exact, aliases, model codes, then fuzzy). Unknown models become plain boxes of the height you gave, flagged "identify later".
3. Missing layers get defaults marked **assumed** (2N A/B power, aisles alternating by row, one cooling zone), listed in the report so you know what to replace.
4. A check list with 3D locations: U overlaps, overweight racks, PDU or breaker over 80 %, single-corded or same-feed devices, heat above cooling, warranty ending within 12 months, unknown models, cable and port problems.
5. Re-upload means update. Devices are matched by serial, then name, then rack and U; you see a change list before anything is applied.

**Limits and safety:** XLSX or CSV/TSV (comma, semicolon, tab; UTF-8, UTF-16, GBK). Values only: formulas are never evaluated; macro-enabled, encrypted and zip-bomb files are refused. 10 MB per file, 50,000 rows per sheet. Bad rows never block an import; each one is listed with its sheet, row and reason.

## Tips from the first imports

- Write the model name the way the vendor prints it; "R740xd" and "PowerEdge R740XD" both match.
- A patch-panel cable is two rows; a cable's `route` can be "in rack", "overhead tray T2" or "under floor".
- Use `power_cords` (A, B or AB) on Devices if you do not want to list every power cable yet.
- Export last week's sensor values from your monitoring into Readings and the air and power layers fit your room.
- Not sure where to start? Open the [filled example](/downloads/demo-hall.xlsx) next to the blank template.
