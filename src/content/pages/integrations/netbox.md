---
title: "NetBox 3D view: racks and devices as a twin — DC Sim"
description: "Connect NetBox with a URL and a read-only token, pick a site, and get its racks, devices, cables, power feeds and VLANs as a 3D twin with what-if."
h1: "NetBox, in 3D"
navLabel: "NetBox"
directAnswer: "DC Sim reads a NetBox site through the NetBox API with a read-only token and turns it into the template sheets: racks, devices, cables, power feeds and VLANs. You see the same import report and checks as an Excel upload, then the site as a 3D twin you can fail node by node. NetBox stays your source of truth; nothing is written back."
section: "integrations"
order: 2
badge: "available"
badgeNote: "Import from NetBox: tested end to end against a live NetBox 4.7 demo instance (24 sites). Two-way sync and a NetBox plugin are on the roadmap."
shots:
  - { name: "replay", alt: "The DC Sim menu open over a 3D view of a cooling unit, with the entry Connect NetBox or Zabbix: inventory, readings and alarms.", caption: "Connect NetBox or Zabbix from the ⋯ menu." }
faq: [{"q": "Which NetBox versions work?", "a": "NetBox 3.x and 4.x through the REST API. It was tested against NetBox 4.7 with both the older and the newer token formats."}, {"q": "What credentials does it need?", "a": "A NetBox API token for a user with read-only permissions. The token is sent to NetBox only; it is never shown in the browser or stored in a report."}, {"q": "Does it change anything in NetBox?", "a": "No. It only reads. Pushing a design back into NetBox as planned objects is on the roadmap and will be opt-in."}, {"q": "My NetBox has many sites. What happens?", "a": "Test lists the sites, biggest first, with their rack and device counts. You import one site at a time, because a whole estate is not one room."}, {"q": "Can I still use a CSV export instead?", "a": "Yes. NetBox's own CSV exports map onto the template sheets as well; header names are matched with synonyms."}]
---

## What you get

- **Floor layer:** every rack of the site in its row, with U used and kW against the rack budget. The import check list adds what NetBox does not model: overweight racks, PDUs or breakers above 80 %, single-corded or same-feed devices, phase balance.
- **Power layer:** power panels, feeds and PDUs become the one-line diagram with A and B colours. Click a feed, press **Fail**, and see which racks go dark and which services stop.
- **Cabling and Network layers:** NetBox cables are routed in 3D through rear managers, trays or under the floor; trace any run. The network topology is laid out from the same cables; fail a switch and see who loses every path.

## How to connect

1. In NetBox, create an API token for a user with **read-only** permissions.
2. In DC Sim, open **⋯ → Connect NetBox or Zabbix**, choose NetBox, paste the URL and the token, press **Test**. Test shows the NetBox version and every site with its racks and devices, biggest first.
3. Pick the **site**. **Preview** shows it as the template sheets (Racks, Devices, Cables, Power, Networks) with the same import report and checks as an Excel upload.
4. **Import.** Re-sync later and you get a change list before anything is applied.

Inside your own network, the same connector runs in the DC Sim agent, which only dials out.

## What we read

| NetBox | DC Sim template | Notes |
|---|---|---|
| racks: name, location, height, width | Racks: rack, row, height_u, width_in | location becomes the row; width 10 draws a mini rack |
| devices: name, rack, position, device type, role, serial, tenant | Devices: name, rack, u, model, role, serial, owner | device types matched to the catalog; a device without a rack is kept at its location as an unracked device; blades travel with their chassis |
| custom fields `warranty_end`, `runs` | Devices: warranty_end, runs | when you keep them |
| power panels and power feeds (primary, redundant) | Power: panels with breakers per feed, A and B | feeds without a rating are flagged in the report |
| PDUs and outlet feed legs | Power rows fed from the cabled feed; Cables: phase | per-phase load and phase balance |
| cables: both ends, type, length and unit, colour, label | Cables: from/to device and port, type, media, length_m, color, label | lengths converted to metres; provider circuits are left out and listed |
| VLANs and prefixes | Networks: vlan, name, purpose, subnet | |

The community NetBox device-type library is CC0-licensed and is being added to the DC Sim device catalog, so more and more device types resolve to a real U height, weight and power draw; anything unmatched becomes a plain box tagged "identify later".

## Later

| Item | Status |
|---|---|
| Interface speeds read from NetBox (today: from port names and the catalog) | <span class="badge badge-roadmap">Roadmap</span> |
| Two-way sync: push a DC Sim design back into NetBox as planned objects | <span class="badge badge-roadmap">Roadmap</span> |
| A NetBox plugin: "Open in DC Sim" on a rack or device | <span class="badge badge-roadmap">Roadmap</span> |

## Nothing inbound

For a NetBox inside your network, the connector runs in a small agent that dials out over one WebSocket and never listens on a port; batches spool to disk and replay in order if the link drops. The token stays in the agent's configuration. DC Sim never writes to NetBox.
