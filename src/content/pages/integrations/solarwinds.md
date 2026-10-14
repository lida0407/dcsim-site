---
title: "SolarWinds data on a 3D data center twin — DC Sim"
description: "Bring SolarWinds inventory and metrics into a 3D twin today via CSV; live connector on the roadmap. Ask to be told when it ships."
h1: "SolarWinds, placed in 3D"
directAnswer: "Today DC Sim builds a 3D twin from a SolarWinds export: a node report, or a SWQL query through the Information Service, becomes the Devices sheet; interface and hardware-health values fill the Readings sheet. SolarWinds keeps monitoring; DC Sim adds the room, the power chain and the what-if. A read-only connector in the DC Sim agent is on the roadmap."
navLabel: "SolarWinds"
section: "integrations"
order: 4
faq: [{"q": "Is the SolarWinds integration live today?", "a": "As a CSV path, yes: export from SolarWinds, map onto the template, import. The read-only connector is on the roadmap."}, {"q": "What credentials does it need?", "a": "None today — you export the files yourself. The roadmap connector will use a SolarWinds account with read-only rights for the Information Service."}, {"q": "Does it change anything in SolarWinds?", "a": "No. Nothing is written to SolarWinds. Writing rack positions back into custom properties is on the roadmap and will be opt-in."}, {"q": "My metrics have different names — will it still work?", "a": "Yes. The Readings sheet takes any item and metric name; known names (`util_pct`, `inlet_c`, `ups_runtime_min` …) drive the simulation directly and anything else can be bound by hand after import."}]
badge: "roadmap"
badgeNote: "CSV today: export nodes and metrics from SolarWinds → map to the DC Sim sheets → import; read-only connector on the roadmap"
---

## What you get

- **Device layer:** node status, CPU load and memory colour each server in its rack. A node that is down shows as a fault on the device, its workloads and its tenant; SAM application monitors become the services a failure would stop.
- **Network layer:** interface speed and utilisation drawn on the auto-laid-out topology; width = speed, colour = utilisation. Fail a switch or link and see who loses every path and who keeps a backup.
- **Power and Air layers:** hardware-health temperatures become rack-inlet colours; UPS load, battery and runtime (estimated when SolarWinds has no runtime value) sit on the one-line diagram. Click the UPS → **Fail** → what goes dark.

## What we read (today)

| SolarWinds export field | DC Sim sheet.column | Layer |
|---|---|---|
| Node `Caption` | Devices.name | Device |
| Node `Vendor` + `MachineType` | Devices.model, matched to the catalog | Device, Power, Air |
| Custom property for the rack (e.g. `Rack`) | Devices.rack | Floor |
| Custom property for the U position (e.g. `RackUnit`) | Devices.u | Floor |
| Custom property or node `Location` for the row | Racks.row | Floor |
| Node `Status` | Readings metric `up` | Device, Network |
| Node `CPULoad`, `PercentMemoryUsed` | Readings metrics `util_pct`, `mem_used_pct` | Device |
| Interface `Speed`; `InBps` / `OutBps` | Cables.speed; Readings item `device:port`, metric `link_mbps` | Network |
| Interface `InErrors` + `OutErrors` | Readings item `device:port`, metric `port_errors` | Network, Cabling |
| Hardware health temperature items | Readings metric `inlet_c` or `temp_c` | Air |
| Hardware health fan and power-supply items | Readings metrics `fan_rpm`, `psu_ok` | Device |
| UPS values (hardware health or a universal device poller): load %, battery %, runtime | Readings metrics `ups_load_pct`, `ups_battery_pct`, `ups_runtime_min` | Power |
| SAM application names on the node | Devices.runs | Device, Token |

SolarWinds has no native rack or U field, so the Devices sheet takes them from the custom properties you already keep. Readings use four columns — time, item, metric, value — so any report with a timestamp fits.

## What we will read / write back (roadmap)

| Item | Status |
|---|---|
| Read-only SolarWinds connector in the DC Sim agent: SWQL queries through the Information Service on a schedule, read-only account | <span class="badge badge-roadmap">Roadmap</span> (today: CSV export) |
| Node inventory → devices and rack positions automatically from custom properties | <span class="badge badge-roadmap">Roadmap</span> |
| SolarWinds alerts → DC Sim alarms with advice | <span class="badge badge-roadmap">Roadmap</span> |
| Write back: DC Sim rack and U assignments into SolarWinds custom properties; export the design as a node import | <span class="badge badge-roadmap">Roadmap</span> |

## Setup

1. **Export from SolarWinds.** Run a web-based report over nodes (Caption, Vendor, MachineType, Status, CPULoad, PercentMemoryUsed and your rack custom properties) and export it as CSV or Excel; or run a SWQL query through the Information Service via the Orion SDK, e.g. `SELECT Caption, Vendor, MachineType, Status, CPULoad, PercentMemoryUsed, CustomProperties.Rack FROM Orion.Nodes`. Export interfaces and hardware-health items the same way.
2. **Map the columns.** Download the DC Sim Excel template and paste the node export into Devices, racks into Racks, metrics into Readings. Headers match case-insensitively with synonyms ("Hostname", "Rack name", "U position", "Model number"), so rename only what the importer cannot guess.
3. **Import.** Import → preview → report → apply. Up to 10 MB per file, 50,000 rows per sheet, values only; bad rows are listed and never block the import.
4. **Read the check list** — U overlaps, overweight racks, breakers above 80 %, unknown models — each with its 3D location; a re-upload shows what changed.
5. **Ask to be told** when the live, read-only SolarWinds connector is ready: [da@mustardseedmt.com](mailto:da@mustardseedmt.com?subject=DC%20Sim%20SolarWinds%20connector).

## Nothing inbound

Today nothing connects to SolarWinds: you upload a file. The roadmap connector will run in the outbound-only DC Sim agent: one WebSocket out, no listening port, batches spooled to disk and replayed in order after an outage, and a read-only SolarWinds account whose credentials never leave your network.
