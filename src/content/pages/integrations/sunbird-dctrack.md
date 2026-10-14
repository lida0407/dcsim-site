---
title: "Sunbird dcTrack inventory as a simulatable twin — DC Sim"
description: "Use your dcTrack inventory as the base of a twin that fails nodes and tracks tokens. CSV today, REST connector on the roadmap."
h1: "dcTrack, simulated"
directAnswer: "dcTrack already holds your cabinets, items and circuits. Today you export those lists — and any Power IQ readings — map them onto the DC Sim sheets and import: a 3D twin you can fail node by node, with a token layer for GPU nodes. dcTrack stays the inventory of record; a read-only connector is on the roadmap."
navLabel: "Sunbird dcTrack"
section: "integrations"
order: 6
faq: [{"q": "Is the dcTrack integration live today?", "a": "As a CSV path, yes: export from dcTrack (and Power IQ), map onto the template, import. The read-only connector is on the roadmap."}, {"q": "What credentials does it need?", "a": "None today — you export the files yourself. The roadmap connector will use read-only dcTrack and Power IQ users."}, {"q": "Does it change anything in dcTrack?", "a": "No. Nothing is written to dcTrack. Pushing designs back as planned items is on the roadmap and will be opt-in; until then you download the filled Excel/CSV and run dcTrack's own import."}, {"q": "My readings have different names — will it still work?", "a": "Yes. The Readings sheet takes any item and metric name; known names (`power_w`, `inlet_c`, `ups_runtime_min` …) drive the simulation directly and anything else can be bound by hand after import."}]
badge: "roadmap"
badgeNote: "CSV today: export cabinets, items and circuits from dcTrack → map to the DC Sim sheets → import; read-only REST connector on the roadmap"
---

## What you get

- **Power layer:** dcTrack power circuits — device power port → rack PDU outlet → floor PDU or panel breaker → UPS — become the one-line diagram with A/B colours. Click any node → **Fail** → which cabinets go dark, which services stop. Loads come from Power IQ readings where you have them, estimated elsewhere.
- **Cabling and Network layers:** data circuits are routed in 3D and traceable end to end; the network topology is laid out from them. Fail a switch: who loses every path.
- **Token layer:** GPU items show tokens/s and tokens per kWh once token counters arrive (Readings sheet today, live connectors on the roadmap), and how many tokens any failure would lose.

## What we read (today)

| dcTrack export field | DC Sim sheet.column | Layer |
|---|---|---|
| Cabinet name | Racks.rack, Devices.rack ("Cabinet" header accepted as-is) | Floor |
| Cabinet row label, position in row | Racks.row, Racks.position | Floor |
| Cabinet U height | Racks.height_u | Floor |
| Cabinet power budget | Racks.max_kw | Floor, Power |
| Cabinet orientation on the floor map (front to which aisle) | Racks.front_faces (A/B) | Air |
| Item name | Devices.name | Device |
| Item make + model (from the dcTrack models library) | Devices.model, matched to the catalog | Device, Power, Air |
| Item U position | Devices.u | Floor |
| Item class / subclass (Device, Network, Rack PDU, Floor PDU, UPS, CRAC, Probe) | Devices.role for racked items; Power or Cooling sheet for floor PDUs, UPS and CRAC units | Device, Power, Air |
| Item serial number / asset tag | Devices.serial | Device |
| Item custom fields: owner or department, warranty end | Devices.owner, Devices.warranty_end | Device |
| Power circuit: device power port → rack PDU outlet | Cables (type power): from_device, from_port, to_device, to_port; Devices.power_cords (A / B / AB) | Power, Cabling |
| Power circuit upstream: rack PDU → floor PDU or panel breaker → UPS, with breaker rating, voltage, phases | Power.name, type, rating, fed_from, feed, voltage, phases | Power |
| Data circuit: port ↔ port, connector and media, length, colour, label | Cables.from/to device and port, media, speed (from the port), length_m, color, label | Cabling, Network |
| Power IQ: PDU outlet or inlet active power; current | Readings metric `power_w`; item `device:port`, metric `current_a` | Power |
| Power IQ: UPS load, battery, runtime | Readings metrics `ups_load_pct`, `ups_battery_pct`, `ups_runtime_min` | Power |
| Power IQ: environmental sensors (inlet temperature, humidity) | Readings metrics `inlet_c`, `humidity_pct` | Air |

Because dcTrack items carry a make and model from its models library, most rows resolve to a catalog entry with real U height, weight and power draw; anything unmatched becomes a plain box tagged "identify later".

## What we will read / write back (roadmap)

| Item | Status |
|---|---|
| Read-only dcTrack REST connector in the DC Sim agent: cabinets, items and circuits pulled on a schedule, each pull producing a change list | <span class="badge badge-roadmap">Roadmap</span> (today: CSV export) |
| Power IQ readings connector (PDU, UPS and sensor values live) | <span class="badge badge-roadmap">Roadmap</span> |
| Floor map coordinates → room layout automatically | <span class="badge badge-roadmap">Roadmap</span> |
| Planned items in dcTrack → a DC Sim design version ("what if we install these 12 servers") | <span class="badge badge-roadmap">Roadmap</span> |
| Write back: push a DC Sim design into dcTrack as planned items through its import spreadsheet | <span class="badge badge-roadmap">Roadmap</span> |

## Setup

1. **Export from dcTrack.** Export the Cabinets list, the Items list (make, model, U position, class, serial, custom fields) and the Connections (power and data circuits) as spreadsheets, or pull them through the dcTrack REST API with a read-only user. From Power IQ, export PDU, UPS and sensor readings with timestamps.
2. **Map the columns.** Download the DC Sim Excel template: cabinets → Racks, items → Devices, floor PDUs / UPS / panels → Power, CRAC units → Cooling, circuits → Cables, readings → Readings. Headers match case-insensitively with synonyms ("Cabinet", "Hostname", "U position"), so rename only what the importer cannot guess.
3. **Import.** Import → preview → report → apply. Up to 10 MB per file, 50,000 rows per sheet, values only; bad rows are listed and never block the import.
4. **Read the check list** — U overlaps, overweight cabinets, breakers above 80 %, unknown models — each with its 3D location; a re-upload shows what changed.
5. **Ask to be told** when the live, read-only dcTrack connector is ready: [da@mustardseedmt.com](mailto:da@mustardseedmt.com?subject=DC%20Sim%20dcTrack%20connector).

## Nothing inbound

Today nothing connects to dcTrack: you upload a file. The roadmap connector will run in the outbound-only DC Sim agent: one WebSocket out, no listening port, batches spooled to disk and replayed in order after an outage, and a read-only dcTrack user whose credentials never leave your network.
