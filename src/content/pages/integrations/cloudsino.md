---
title: "CloudSino DCIM and DC Sim"
description: "CloudSino distributes the Chinese-language edition and is a data source for the Sensaka edition via CSV today."
h1: "CloudSino partnership"
directAnswer: "CloudSino is DC Sim's channel partner: it distributes the Chinese-language edition of the product — same engine, same importer, interface in 中文 or English. For the Sensaka edition, a CloudSino DCIM export (device assets, cabinets, power and cooling equipment, monitoring history) imports through the Excel/CSV template today. A live, read-only connector to CloudSino monitoring is on the roadmap."
navLabel: "CloudSino"
section: "integrations"
order: 8
faq: [{"q": "Is the CloudSino integration live today?", "a": "The Chinese-language edition of DC Sim is available through CloudSino. For the Sensaka edition, CloudSino exports import through the Excel/CSV template today; the live connector is on the roadmap."}, {"q": "What credentials does it need?", "a": "None today — you export the files yourself. The roadmap connector will use a CloudSino account with read-only rights."}, {"q": "Does it change anything in CloudSino?", "a": "No. Nothing is written to CloudSino. Pushing designs back into its asset inventory is on the roadmap and will be opt-in; until then you download the filled Excel/CSV and import it yourself."}, {"q": "My metrics have different names — will it still work?", "a": "Yes. The Readings sheet takes any item and metric name, in English or Chinese headers; known names (`inlet_c`, `power_w`, `ups_runtime_min` …) drive the simulation directly and anything else can be bound by hand after import."}]
badge: "partner"
badgeNote: "CloudSino distributes the Chinese-language edition of DC Sim; CloudSino DCIM exports are a CSV data source for the Sensaka edition today; live connector on the roadmap"
---

## What you get

- **Floor and Device layers:** the CloudSino asset list becomes racks and devices in 3D, with the import check list on top: U overlaps, overweight cabinets, unknown models, and warranties ending within 12 months taken from the asset's warranty field.
- **Power layer:** UPS, panel and PDU records become the one-line diagram with A/B colours. Click any node → **Fail** → which cabinets go dark, which services stop, what overloads.
- **Air layer:** temperature and humidity history from CloudSino monitoring colours the rack inlets; stop an air conditioner and minutes to 27 / 32 / 35 °C are estimated.

## What we read (today)

| CloudSino export field | DC Sim sheet.column | Layer |
|---|---|---|
| Asset name / hostname | Devices.name | Device |
| Brand + model | Devices.model, matched to the catalog | Device, Power, Air |
| Cabinet | Devices.rack, Racks.rack | Floor |
| Starting U | Devices.u | Floor |
| Asset type (server, switch, storage, UPS, PDU, air conditioner …) | Devices.role; facility rows also go to the Power or Cooling sheet | Device, Power, Air |
| Serial number; owner (负责人); warranty end (质保到期); business system (业务) | Devices.serial, owner, warranty_end, runs | Device |
| Cabinet list: row, position, U height, rated power | Racks.row, position, height_u, max_kw | Floor, Power |
| Power equipment: UPS, panels, PDUs with rating and upstream source | Power.name, type, rating, fed_from, feed | Power |
| Air conditioners: cooling capacity, served area | Cooling.name, type, capacity_kw, serves | Air |
| Port-to-port links, if exported | Cables.from_device, from_port, to_device, to_port, type | Cabling, Network |
| Monitoring history: temperature, humidity, power, UPS load / battery / runtime | Readings (time, item, metric, value) with metrics `inlet_c`, `humidity_pct`, `power_w`, `ups_load_pct`, `ups_battery_pct`, `ups_runtime_min` | Air, Power |

Chinese column headers are accepted alongside English ones — 负责人, 质保到期 and 业务 are built-in synonyms — and GBK-encoded files read correctly. Brand and model text not in the catalog becomes a plain box tagged "identify later".

## What we will read / write back (roadmap)

| Item | Status |
|---|---|
| Live, read-only connector to CloudSino monitoring in the DC Sim agent (temperature, power, UPS values on a schedule) | <span class="badge badge-roadmap">Roadmap</span> (today: CSV export) |
| Asset sync: CloudSino assets and cabinets → devices and rack positions automatically; each sync produces a change list | <span class="badge badge-roadmap">Roadmap</span> |
| CloudSino alarms → DC Sim alarms with advice | <span class="badge badge-roadmap">Roadmap</span> |
| Write back: a DC Sim design into CloudSino's asset import | <span class="badge badge-roadmap">Roadmap</span> |

## Setup

1. **Export from CloudSino.** Export the asset list, the cabinet list, the power and cooling equipment lists and a monitoring-history report (CSV or Excel), each with the fields in the table above.
2. **Map the columns.** Download the DC Sim Excel template: assets → Devices, cabinets → Racks, UPS / panels / PDUs → Power, air conditioners → Cooling, links → Cables, history → Readings. Headers match case-insensitively with English and Chinese synonyms, so rename only what the importer cannot guess.
3. **Import.** Import → preview → report → apply. Up to 10 MB per file, 50,000 rows per sheet, values only; bad rows are listed and never block the import.
4. **Read the check list** — U overlaps, overweight cabinets, breakers above 80 %, unknown models, warranties ending within 12 months — each with its 3D location; a re-upload shows what changed.
5. **Ask to be told** when the live, read-only CloudSino connector is ready: [da@mustardseedmt.com](mailto:da@mustardseedmt.com?subject=DC%20Sim%20CloudSino%20connector).

## Nothing inbound

Today nothing connects to CloudSino: you upload a file. The roadmap connector will run in the outbound-only DC Sim agent: one WebSocket out, no listening port, batches spooled to disk and replayed in order after an outage, and a read-only CloudSino account whose credentials never leave your network.
