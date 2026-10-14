---
title: "ManageEngine OpManager on a 3D twin — DC Sim"
description: "Put OpManager devices and metrics on a simulatable 3D twin. CSV today, REST connector on the roadmap."
h1: "OpManager, placed in 3D"
directAnswer: "Today DC Sim builds a 3D twin from an OpManager export: the Inventory device list (or the REST API listing) becomes the Devices sheet, Rack view placements and custom fields give rack and U, and monitor exports fill the Readings sheet. OpManager keeps monitoring; DC Sim adds the room and the what-if. A read-only REST connector is on the roadmap."
navLabel: "ManageEngine OpManager"
section: "integrations"
order: 5
faq: [{"q": "Is the OpManager integration live today?", "a": "As a CSV path, yes: export from OpManager, map onto the template, import. The read-only REST connector is on the roadmap."}, {"q": "What credentials does it need?", "a": "None today — you export the files yourself. The roadmap connector will use an OpManager REST API key for a user with read-only rights."}, {"q": "Does it change anything in OpManager?", "a": "No. Nothing is written to OpManager. Writing rack placements back is on the roadmap and will be opt-in; until then you download the filled Excel/CSV and import it yourself."}, {"q": "My metrics have different names — will it still work?", "a": "Yes. The Readings sheet takes any item and metric name; known names (`util_pct`, `inlet_c`, `ups_runtime_min` …) drive the simulation directly and anything else can be bound by hand after import."}]
badge: "roadmap"
badgeNote: "CSV today: export inventory and monitor values from OpManager → map to the DC Sim sheets → import; read-only REST connector on the roadmap"
---

## What you get

- **Device layer:** availability, CPU and memory utilisation colour each server in its rack; a device that is down shows as a fault on the device, its workloads and its tenant.
- **Network layer:** interface speed, traffic and errors drawn on the auto-laid-out topology, Layer 2 links included if you export them. Fail a switch or link and see who loses every path.
- **Power and Air layers:** hardware-monitor temperatures become rack-inlet colours; UPS load, battery and runtime (estimated when OpManager has no runtime value) sit on the one-line diagram. Click the UPS → **Fail** → what goes dark; minutes to 27 / 32 / 35 °C are estimated.

## What we read (today)

| OpManager export field | DC Sim sheet.column | Layer |
|---|---|---|
| Device display name | Devices.name | Device |
| Vendor + device type / model (from the device template) | Devices.model, matched to the catalog | Device, Power, Air |
| Rack view: rack name and slot (or a custom field) | Devices.rack, Devices.u | Floor |
| Rack view: row and order on the floor (or a custom field) | Racks.row, Racks.position | Floor |
| Category (Server, Switch, Router, Firewall, UPS, Storage …) | Devices.role; UPS and PDU rows also go to the Power sheet | Device, Power |
| Custom fields: serial number, owner, business service | Devices.serial, owner, runs | Device |
| Device availability / status | Readings metric `up` | Device, Network |
| CPU utilisation %, memory utilisation % | Readings metrics `util_pct`, `mem_used_pct` | Device |
| Interface speed; In / Out traffic | Cables.speed; Readings item `device:port`, metric `link_mbps` | Network |
| Interface In / Out errors and discards | Readings item `device:port`, metric `port_errors` | Network, Cabling |
| Hardware monitors: temperature, fan speed, power supply status | Readings metrics `inlet_c` / `temp_c`, `fan_rpm`, `psu_ok` | Air, Device |
| UPS monitors (SNMP device template): load %, battery capacity %, runtime | Readings metrics `ups_load_pct`, `ups_battery_pct`, `ups_runtime_min` | Power |
| Layer 2 map links: device A port ↔ device B port | Cables.from_device, from_port, to_device, to_port; type network | Cabling, Network |

OpManager's inventory has no U position of its own, so rack and U come from the Rack view placement or a custom field — whichever you maintain. Readings use four columns — time, item, metric, value — so any monitor export with a timestamp fits.

## What we will read / write back (roadmap)

| Item | Status |
|---|---|
| Read-only REST connector in the DC Sim agent: device list, interface traffic and monitor values polled on a schedule with an API key | <span class="badge badge-roadmap">Roadmap</span> (today: CSV export) |
| Inventory → devices and rack positions automatically from Rack view | <span class="badge badge-roadmap">Roadmap</span> |
| OpManager alarms → DC Sim alarms with advice | <span class="badge badge-roadmap">Roadmap</span> |
| Write back: DC Sim rack placements into Rack view; export the design as an OpManager device import | <span class="badge badge-roadmap">Roadmap</span> |

## Setup

1. **Export from OpManager.** Inventory → Devices → export as CSV or Excel, or call the REST API device listing with an API key. Export interface traffic, hardware monitors and UPS values from their monitor views (or the matching REST calls) with timestamps.
2. **Map the columns.** Download the DC Sim Excel template and paste devices into Devices, rack placements into Racks, UPS and PDU rows into Power, metrics into Readings. Headers match case-insensitively with synonyms ("Hostname", "Rack name", "U position", "Model number"), so rename only what the importer cannot guess.
3. **Import.** Import → preview → report → apply. Up to 10 MB per file, 50,000 rows per sheet, values only; bad rows are listed and never block the import.
4. **Read the check list** — U overlaps, overweight racks, breakers above 80 %, unknown models — each with its 3D location; a re-upload shows what changed.
5. **Ask to be told** when the live, read-only OpManager connector is ready: [da@mustardseedmt.com](mailto:da@mustardseedmt.com?subject=DC%20Sim%20OpManager%20connector).

## Nothing inbound

Today nothing connects to OpManager: you upload a file. The roadmap connector will run in the outbound-only DC Sim agent: one WebSocket out, no listening port, batches spooled to disk and replayed in order after an outage, and an OpManager API key that only reads and never leaves your network.
