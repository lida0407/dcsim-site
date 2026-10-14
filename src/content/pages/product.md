---
title: "Data center digital twin from an Excel file — DC Sim"
description: "Nine layers, four modes, one canvas. Floor, air, water, fire, power, cabling, network, device and token layers built from your spreadsheet, in the browser."
h1: "From a spreadsheet to a living 3D twin"
navLabel: "Overview"
directAnswer: "A data center digital twin is a model of your room that answers \"what happens if\". DC Sim builds one from a single Excel file: racks, devices, power chain, cables, cooling. Nine layers show the room from different angles, four modes take it from design to incident replay, and every number the engine estimates says so."
section: "product"
order: 0
shots:
  - { name: "view-menu", alt: "DC Sim with the View menu open over the 3D demo hall: Overview, then Facility (Floor, Air, Water, Fire, Power), Connectivity (Cabling, Network) and IT (Device, Token), each with a one-line hint and an issue count.", caption: "One View menu: nine layers in three groups, with an issue count per view." }
faq: [{"q": "How long does the first twin take?", "a": "Minutes if your Devices sheet is ready: rack, U and model per row. The catalog fills in size, weight, power and parts for known models; unknown models become plain boxes marked \"identify later\"."}, {"q": "What happens if my spreadsheet has errors?", "a": "Bad rows never block the import. Each skipped row is listed with its sheet, row and reason; checks like U overlaps, overweight racks and breakers over 80 % are pinned in 3D."}, {"q": "Can I use CSV instead of Excel?", "a": "Yes: the same sheets as CSV or TSV files (comma, semicolon or tab; UTF-8, UTF-16 or GBK). Up to 10 MB per file and 50,000 rows per sheet."}, {"q": "Does the twin update when my room changes?", "a": "Re-upload the file: devices are matched by serial, then name, then rack and U, and you get a change list before anything is applied. Live connectors to your monitoring are on the roadmap."}, {"q": "Is it a DCIM?", "a": "It sits on top of DCIM and monitoring rather than replacing them. It documents less and simulates more: the point is \"fail this, see what goes dark\", not asset accounting."}]
---

## One canvas, one View menu

The whole screen is the room. A **View** menu switches the lens; a **Mode** menu changes what you are doing. A time slider scrubs the past week, live, or a 24-hour forecast. A legend, search, one primary button. Nothing else on screen at rest: six controls on a desktop, four on a phone.

## Nine layers

| Group | Layers | What you see | What-if it answers |
|---|---|---|---|
| **Facility** ([more](/product/facility/)) | Floor · Air · Water · Fire · Power | tiles, aisles, racks with U and kW budgets; inlet and exhaust temperature; coolant loops; fire zones; the power chain as a one-line diagram | Will it fit? A cooler stops: minutes to threshold (estimated). A leak: racks isolated. A fire: the suppression sequence. Any power node fails: what goes dark |
| **Connectivity** ([more](/product/connectivity/)) | Cabling · Network | every cable routed in 3D; a topology laid out from the cables | Cut a cable; fail a switch or link: who loses every path |
| **IT** ([more](/product/it/)) | Device · Token | status, faults, LEDs; open and dissect any server; tokens per second and tokens per kWh | A fault on a part: workloads and tenants affected; tokens lost in any scenario |

## Four modes, plus Import and Report

| Mode | Job | Highlights |
|---|---|---|
| **Design** | plan a room or a change | 2D plan; place, drag, rotate and delete racks and coolers; live design checks; N−1 resilience audit; publish as a version → [Design mode](/product/design/) |
| **Monitor** | daily operations | KPIs (IT kW, PUE, tokens/s, tokens per kWh, hottest inlet), alarms with advice, top token producers |
| **Simulate** | drills and capacity what-if | a scenario library generated from your model; custom fails; each run beside an untouched baseline → [Simulate](/product/simulate/) |
| **Replay** | incident forensics | the week's critical and major alarms on the slider; export an incident log |

**Import** is always one click: Excel or CSV, preview, import report, change list on re-upload, template and example downloads. **Report** gives energy, PUE, CO₂ and cost; tokens by workload, tenant, model and server; capacity runway; thermal; incidents; warranty. KPI values that come from the model rather than a sensor carry the **estimated** tag.

## What-if, two speeds

**Fail** runs a fast graph propagation on the server: power failures darken devices, the network graph loses them, and the diagram, the 3D view and the banner update at once. **Simulate it** replays the same failure through the full simulator (batteries, generator start, thermal transients, breaker curves, tokens lost), so you see the timeline, not just the end state.

## Built for honesty

- Zonal thermal and fluid models with "estimated" labels. Not CFD, and we never say it is.
- Defaults are marked **assumed** in the import report (2N A/B power, alternating aisles, one cooling zone) until you give real data.
- The simulation engine runs on the server; your browser receives frames. The importer never evaluates formulas or macros.

## Two ways in

- **Excel or CSV**, available today: the Devices sheet is required, six more are optional. → [the Excel template](/resources/excel-template/)
- **Live data from your monitoring** <span class="badge badge-roadmap">Roadmap</span>: Zabbix and NetBox first, through a small agent that only dials out. Until then, any tool's export fits the Readings sheet. → [Integrations](/integrations/)
