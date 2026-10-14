---
title: "NetBox 3D view: racks and devices as a twin — DC Sim"
description: "Export NetBox racks, devices and cables to the DC Sim template and get a 3D twin with what-if. Two-way sync plugin on the roadmap."
h1: "NetBox, in 3D"
directAnswer: "Today DC Sim builds a 3D twin from a NetBox export: racks, devices, cables and power feeds map onto the DC Sim sheets almost column for column. NetBox stays your source of truth; DC Sim adds the room, the power chain and the what-if. A read-only connector and a two-way sync plugin are on the roadmap."
navLabel: "NetBox"
section: "integrations"
order: 2
faq: [{"q": "Is the NetBox integration live today?", "a": "As a CSV path, yes: export from NetBox, map onto the template, import. The read-only connector and the plugin are on the roadmap."}, {"q": "What credentials does it need?", "a": "None today — you export the files yourself. The roadmap connector will use a NetBox API token with write access disabled."}, {"q": "Does it change anything in NetBox?", "a": "No. Nothing is written to NetBox. Two-way sync is on the roadmap and will be opt-in; until then you download the filled Excel/CSV and run NetBox's bulk import yourself."}, {"q": "My columns have different names — will it still work?", "a": "Yes. The importer accepts common synonyms for every column and NetBox's export headers as they are; an unknown model string becomes a plain box tagged \"identify later\" that you can fix later."}]
badge: "roadmap"
badgeNote: "CSV today: export from NetBox → map to the DC Sim sheets → import; read-only connector and sync plugin on the roadmap"
---

## What you get

- **Floor layer:** every NetBox rack drawn in its row with U used % and kW against the rack budget. The import check list flags what NetBox does not model: overweight racks, PDUs or breakers above 80 %, single-corded or same-feed devices.
- **Power layer:** NetBox power panels, feeds, PDUs and power ports become the one-line diagram with A/B colours. Click a feed → **Fail** → see which racks go dark and which services stop.
- **Cabling and Network layers:** NetBox cables are routed in 3D through rear managers, trays or under the floor; trace any run. The network topology is laid out from the same cables; fail a switch and see who loses every path.

## What we read (today)

| NetBox export field (CSV or REST) | DC Sim sheet.column | Layer |
|---|---|---|
| Rack `name` | Racks.rack, Devices.rack | Floor |
| Rack `location` (or a custom field you use for the row) | Racks.row | Floor |
| Rack order within the row (custom field; NetBox has no native position) | Racks.position | Floor |
| Rack `u_height` | Racks.height_u | Floor |
| Device `name` | Devices.name | Device |
| Device `device_type` (manufacturer + model) | Devices.model, matched to the catalog | Device, Power, Air |
| Device `position` (lowest U) | Devices.u | Floor |
| Device `role` | Devices.role | Device |
| Device `serial`, `tenant` | Devices.serial, Devices.owner | Device |
| Connected power ports per device (1 → A or B; 2 on different feeds → AB) | Devices.power_cords | Power |
| Cable `Side A Device` / `Side A Name`, `Side B Device` / `Side B Name` | Cables.from_device, from_port, to_device, to_port (headers accepted as exported) | Cabling |
| Cable `type` (cat6, mmf-om4, smf-os2, power …) | Cables.type (power / network / storage / console) and Cables.media | Cabling, Network |
| Cable `length` + `length_unit`, `color`, `label` | Cables.length_m, color, label | Cabling |
| Interface `type` (1000base-t, 10gbase-x-sfpp, 25gbase-x-sfp28, 100gbase-x-qsfp28 …) | Cables.speed | Network |
| Interface `untagged_vlan` / `tagged_vlans` | Cables.vlan | Network |
| Power feed `name`, `amperage`, `voltage`, `phase`, `type` (primary / redundant) | Power.name, rating, voltage, phases, feed | Power |
| Power panel → feed → PDU chain | Power.fed_from | Power |
| VLAN `vid`, `name`, `description`; prefix `prefix` | Networks.vlan, name, purpose, subnet | Network |

The community NetBox device-type library is CC0-licensed and is being added to the DC Sim device catalog, so more and more `device_type` values resolve to a real U height, weight and power draw; anything unmatched becomes a plain box tagged "identify later".

## What we will read / write back (roadmap)

| Item | Status |
|---|---|
| Live NetBox connector: paste the NetBox URL and a read-only API token, press Test, preview racks, devices, cables, power feeds and VLANs as the template sheets, import; re-sync shows a change list. Tested against a demo instance before it is called available | <span class="badge badge-roadmap">Roadmap</span> (today: CSV export) |
| NetBox plugin: "Open in DC Sim" on a rack or device, 3D view inside NetBox | <span class="badge badge-roadmap">Roadmap</span> |
| Two-way sync: push a DC Sim design (new racks, devices, cables) back into NetBox as planned objects | <span class="badge badge-roadmap">Roadmap</span> |
| Power port allocated / maximum draw → per-device load defaults | <span class="badge badge-roadmap">Roadmap</span> |

## Setup

1. **Export from NetBox.** On each list view — Racks, Devices, Cables, Power Feeds, VLANs — use **Export → All data (CSV)**. Or query the REST API with a token that has *write enabled* switched off: `/api/dcim/racks/`, `/api/dcim/devices/`, `/api/dcim/cables/`, `/api/dcim/power-feeds/`, `/api/ipam/vlans/`.
2. **Map the columns.** Download the DC Sim Excel template and paste each export into its sheet (Racks, Devices, Cables, Power, Networks). Headers match case-insensitively with synonyms ("Rack name", "Hostname", "U position", "Side A Device" work as exported). Add a row and position per rack, since NetBox has none.
3. **Import.** Import → preview → report → apply. Up to 10 MB per file, 50,000 rows per sheet, values only; bad rows are listed and never block the import.
4. **Read the check list** — U overlaps, overweight racks, breakers above 80 %, unknown models — each with its 3D location; a re-upload after fixing NetBox shows what changed.
5. **Ask to be told** when the live, read-only NetBox connector is ready: [da@mustardseedmt.com](mailto:da@mustardseedmt.com?subject=DC%20Sim%20NetBox%20connector).

## Nothing inbound

Today nothing connects to NetBox: you upload a file. The roadmap connector will run in the outbound-only DC Sim agent: one WebSocket out, no listening port, batches spooled to disk and replayed in order after an outage, and a NetBox token without write permission that never leaves your network.
