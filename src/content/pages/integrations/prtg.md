---
title: "PRTG sensors on a 3D data center twin — DC Sim"
description: "Place PRTG sensor data on the rack it belongs to. CSV today, API connector on the roadmap."
h1: "PRTG, placed in 3D"
directAnswer: "Today DC Sim reads what PRTG already exports: device and sensor tables from the HTTP API (`table.xml` with CSV output) or any sensor's historic-data CSV, mapped onto the Devices and Readings sheets. The 3D twin shows each sensor's value on the device it belongs to. PRTG keeps monitoring; a read-only connector in the DC Sim agent is on the roadmap."
navLabel: "PRTG"
section: "integrations"
order: 7
faq: [{"q": "Is the PRTG integration live today?", "a": "As a CSV path, yes: export device and sensor tables from PRTG, map onto the template, import. The read-only connector is on the roadmap."}, {"q": "What credentials does it need?", "a": "None today — you export the files yourself. The roadmap connector will use a PRTG API token for a user with read-only access rights."}, {"q": "Does it change anything in PRTG?", "a": "No. Nothing is written to PRTG — no sensors, no devices, no notifications. Writing rack tags back is on the roadmap and will be opt-in."}, {"q": "My channels have different names — will it still work?", "a": "Yes. The Readings sheet takes any item and metric name; known names (`util_pct`, `inlet_c`, `ups_runtime_min` …) drive the simulation directly and anything else can be bound by hand after import."}]
badge: "roadmap"
badgeNote: "CSV today: export devices and sensor values from PRTG → map to the DC Sim sheets → import; read-only API connector on the roadmap"
---

## What you get

- **Device layer:** Ping, CPU and memory sensors colour each server in its rack; a red sensor shows as a fault on the device, its workloads and its tenant.
- **Network layer:** SNMP Traffic sensors give speed, utilisation and errors per port on the auto-laid-out topology. Fail a switch or link and see who loses every path.
- **Power and Air layers:** temperature channels from system-health sensors become rack-inlet colours; UPS sensors put load, battery and runtime (estimated when PRTG has no runtime channel) on the one-line diagram. Click the UPS → **Fail** → what goes dark; minutes to 27 / 32 / 35 °C are estimated.

## What we read (today)

| PRTG export field | DC Sim sheet.column | Layer |
|---|---|---|
| Device name (`content=devices`) | Devices.name | Device |
| Device tags such as `rack:A01` and `u:17`, or the Location / Comments field (PRTG has no rack field) | Devices.rack, Devices.u | Floor |
| Group or probe name, if you group per row | Racks.row | Floor |
| Model text (a tag, the Comments field, or the type auto-discovery detected) | Devices.model, matched to the catalog | Device, Power, Air |
| Ping sensor status | Readings metric `up` | Device, Network |
| CPU Load sensor last value (SNMP, WMI or SSH) | Readings metric `util_pct` | Device |
| Memory sensor % | Readings metric `mem_used_pct` | Device |
| SNMP Traffic sensor channels Traffic In / Traffic Out | Readings item `device:port`, metric `link_mbps` | Network |
| SNMP Traffic sensor channels Errors In / Errors Out | Readings item `device:port`, metric `port_errors` | Network, Cabling |
| Temperature channels from system-health sensors (SNMP hardware, IPMI) | Readings metric `inlet_c` or `temp_c` | Air |
| Fan and power-supply channels | Readings metrics `fan_rpm`, `psu_ok` | Device |
| UPS sensors: load %, battery capacity %, remaining runtime | Readings metrics `ups_load_pct`, `ups_battery_pct`, `ups_runtime_min` | Power |
| Power-meter or PDU sensors with a watts channel | Readings metric `power_w` | Power, Token (tokens per kWh) |

PRTG's `historicdata` CSV has one row per timestamp, so it drops straight into the Readings sheet — time, item, metric, value — with the device name as item and the channel name as metric.

## What we will read / write back (roadmap)

| Item | Status |
|---|---|
| Read-only PRTG connector in the DC Sim agent: device tree and sensor values polled through the HTTP API with a read-only API token | <span class="badge badge-roadmap">Roadmap</span> (today: CSV export) |
| Device tree → devices and rack positions automatically from tags | <span class="badge badge-roadmap">Roadmap</span> |
| PRTG sensor states → DC Sim alarms with advice | <span class="badge badge-roadmap">Roadmap</span> |
| Write back: rack and U tags on PRTG devices from the DC Sim design | <span class="badge badge-roadmap">Roadmap</span> |

## Setup

1. **Export from PRTG.** With a read-only API token, call `table.xml?content=devices&output=csvtable` (columns: device, host, group, tags, location, comments) and `table.xml?content=sensors&output=csvtable` (device, sensor, status, last value). For a time series, download a sensor's **Historic Data** tab as CSV or call `historicdata.csv` with the sensor id and date range.
2. **Map the columns.** Download the DC Sim Excel template and paste devices into Devices (rack and U from your tags), rack groups into Racks, sensor values into Readings. Headers match case-insensitively with synonyms ("Hostname", "Rack name", "U position", "Model number"), so rename only what the importer cannot guess.
3. **Import.** Import → preview → report → apply. Up to 10 MB per file, 50,000 rows per sheet, values only; bad rows are listed and never block the import.
4. **Read the check list** — U overlaps, overweight racks, breakers above 80 %, unknown models — each with its 3D location; a re-upload shows what changed.
5. **Ask to be told** when the live, read-only PRTG connector is ready: [da@mustardseedmt.com](mailto:da@mustardseedmt.com?subject=DC%20Sim%20PRTG%20connector).

## Nothing inbound

Today nothing connects to PRTG: you upload a file. The roadmap connector will run in the outbound-only DC Sim agent: one WebSocket out, no listening port, no notification webhook to expose, batches spooled to disk and replayed in order after an outage, and a PRTG API token with read-only access that never leaves your network.
