---
title: "Grafana and Prometheus metrics on a 3D twin — DC Sim"
description: "Put GPU, token, IPMI and UPS metrics from your Prometheus exporters on the rack they belong to. Grafana CSV import today; live collector on the roadmap."
h1: "Prometheus metrics, placed on the rack"
navLabel: "Grafana and Prometheus"
directAnswer: "Today any Grafana panel exports its data as CSV, and that CSV fits the Readings sheet of the DC Sim template. Next, the agent will scrape your Prometheus exporters directly (GPU telemetry, serving-stack token counters, IPMI and SNMP UPS values) and place them on the server, rack and power chain they belong to. A Grafana panel that embeds the twin is on the roadmap."
section: "integrations"
order: 3
badge: "roadmap"
badgeNote: "Grafana CSV exports today. Prometheus collector: built into the agent, not yet tested against live exporters. Grafana panel: roadmap."
faq: [{"q": "Is the Grafana and Prometheus integration live today?", "a": "Not as a live connector. Today a Grafana panel's CSV export goes into the Readings sheet. The Prometheus collector is built into the agent and is not yet tested against live exporters; the Grafana panel is on the roadmap."}, {"q": "What credentials will it need?", "a": "Usually none: exporters are typically unauthenticated inside the network. For an endpoint behind a proxy, a bearer token or a read-only username and password, kept in the agent's configuration."}, {"q": "Will it change anything in Prometheus or Grafana?", "a": "No. The agent only reads /metrics endpoints; it does not use remote-write, a push gateway or the Grafana API."}, {"q": "My metric names are custom. Will they work?", "a": "Known families map automatically; anything else can be passed through with an include pattern and bound to a device by hand."}]
---

## What you get

- **Token layer:** serving-stack token counters become tokens per second per server and tokens per kWh as colour across the room: which node produced the most tokens, and how many tokens any scenario would lose.
- **Device layer:** GPU utilisation, temperature, power and memory; node CPU and memory per host, shown on the server in its rack.
- **Power and Air layers:** IPMI watts and inlet temperatures; UPS runtime, load, battery and on-battery state on the one-line diagram. Click the UPS, press **Fail**, see what goes dark; minutes to 27, 32 and 35 °C are estimated.

## What you can do today

In Grafana, open any panel and use **Inspect → Data → Download CSV**. You get time and value columns; add `item` (the device name) and `metric` columns and paste the rows into the **Readings** sheet. Metric names such as `power_w`, `inlet_c`, `util_pct` or `ups_runtime_min` drive the simulation directly; anything else is kept as a series you can bind by hand.

## What the collector reads

| Exporter family | DC Sim metric | Layer |
|---|---|---|
| GPU telemetry exporter: utilisation, temperature, power, memory | GPU util %, GPU °C, GPU W, GPU memory | Device, Token |
| vLLM and SGLang: generation and prompt token counters | generated and prompt tokens (counter to rate) | Token |
| LiteLLM: total, input and output tokens, requests | tokens per model, requests | Token |
| node_exporter: CPU seconds, memory, hardware temperatures | CPU %, memory %, CPU °C | Device, Air |
| ipmi_exporter: power, temperatures (inlet, intake, ambient), fans | power W, inlet °C, fan rpm | Power, Air, Device |
| snmp_exporter with the standard UPS-MIB: minutes remaining, load, charge, output source | UPS runtime, load %, battery %, on battery | Power |
| any family matching your include patterns | raw series (counters become rates) to bind by hand | Import |

## Later

| Item | Status |
|---|---|
| Live collector scraping your exporters through the agent | <span class="badge badge-roadmap">Roadmap</span> (built, in testing) |
| Read from the Prometheus server itself, one target instead of one per exporter | <span class="badge badge-roadmap">Roadmap</span> |
| Grafana panel: the 3D twin as a panel whose time range follows the dashboard | <span class="badge badge-roadmap">Roadmap</span> |
| Grafana alert rules as DC Sim alarms with advice | <span class="badge badge-roadmap">Roadmap</span> |

## Nothing inbound

The agent will dial out over one WebSocket and never listen on a port: no remote-write, no push gateway, no scrape target to expose. If the link drops, batches spool to disk and replay in order. Exporter credentials stay in the agent's configuration; DC Sim receives metric values only.
