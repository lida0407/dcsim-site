---
title: "Zabbix data center visualization in 3D — DC Sim"
description: "Put Zabbix hosts and item values (temperatures, power, UPS runtime) on a 3D twin of your room. Readings import today; live connector on the roadmap."
h1: "Zabbix, visualised in 3D"
navLabel: "Zabbix"
directAnswer: "Zabbix keeps monitoring; DC Sim adds the room, the what-if and the token layer. Today you bring Zabbix values in as a Readings sheet. The live Zabbix connector reads hosts, items and problems through the Zabbix API with a read-only token, and turns them into the same template sheets; it is on the roadmap until it passes its test against a demo instance."
section: "integrations"
order: 1
badge: "roadmap"
badgeNote: "Readings import today. Live connector: built into the agent, being tested against a Zabbix 6.0 demo instance."
faq: [{"q": "Is the Zabbix integration live today?", "a": "Not yet. Today you export values from Zabbix into the Readings sheet. The live connector is built and is being tested against a demo instance; this page changes to Available when that test is logged."}, {"q": "What credentials will it need?", "a": "A Zabbix API token for a read-only user (Zabbix 6.0 or later), or a read-only username and password. The token stays inside your network, in the agent's configuration."}, {"q": "Will it change anything in Zabbix?", "a": "No. It reads hosts, items, history and problems. Writing anything back is not planned without an explicit opt-in."}, {"q": "My item names are different. Will it still work?", "a": "The mapping goes by key and unit, not by name: anything with a temperature, watt, load-percent or runtime unit is recognised, and leftover series can be bound by hand."}]
---

## What you get

- **Power layer:** UPS load, runtime and battery charge on the one-line diagram, with PDU and IPMI power on the devices. Click the UPS, press **Fail**, and see which racks go dark and which services stop.
- **Air layer:** temperature items become rack-inlet or exhaust readings; the room colours itself and "minutes to 27, 32 and 35 °C" is estimated when a cooling unit is failed.
- **Device layer and alarms:** CPU load and ping on each server in its rack; Zabbix problems appear as alarms on the matching device, with its workloads and tenants.

## What you can do today

Export recent values from Zabbix (item history as plain values, per host) and put them in the **Readings** sheet of the template: `time`, `item` (the host name), `metric`, `value`. Use metric names such as `power_w`, `inlet_c`, `ups_runtime_min` or `util_pct` and the simulation uses them directly; anything else is kept as a series you can bind by hand. Put the hosts themselves in the **Devices** sheet (rack, U, model). Then import as usual.

## How the live connector will work

1. **Connect:** paste the Zabbix URL and a read-only API token, press **Test**. The test shows the Zabbix version, how many hosts it can see and whether the permissions are read-only.
2. **Preview:** hosts become the Devices sheet (inventory fields such as location, rack, model and serial where you keep them), item history becomes the Readings sheet, open problems become alarms. You see the same import report and checks as an Excel upload.
3. **Import and re-sync:** confirm to build or update the twin; every re-sync shows a change list first.

| Zabbix | DC Sim template |
|---|---|
| host name, host inventory (location, rack, model, serial) | Devices: name, rack, model, serial |
| item history: power (PDU, UPS, IPMI) | Readings: `power_w` |
| item history: inlet or ambient temperature | Readings: `inlet_c` |
| item history: current | Readings: `current_a` |
| item history: interface traffic | Readings: `link_mbps` |
| item history: UPS runtime, load, battery | Readings: `ups_runtime_min`, `ups_load_pct`, `ups_battery_pct` |
| open problems | alarms on the matching device |

## Later

| Item | Status |
|---|---|
| Live connector: hosts, items, history and problems through the agent | <span class="badge badge-roadmap">Roadmap</span> (in testing) |
| Rack positions from host inventory, automatically | <span class="badge badge-roadmap">Roadmap</span> |
| A Zabbix template for listing where Zabbix users look for integrations | <span class="badge badge-roadmap">Roadmap</span> |

## Nothing inbound

For your own network, the connector runs in a small agent inside it that dials out over one WebSocket and never listens on a port. If the link drops, batches spool to disk and replay in order. The Zabbix token stays in the agent's configuration; DC Sim receives metric values only.
