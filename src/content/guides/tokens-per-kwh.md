---
title: "Tokens per kWh: the one metric for an AI room"
description: "Tokens per kWh ties LLM inference output to the power bill. Convert joules per token and tokens per watt, get cost per 1M tokens, and pick a boundary."
h1: "Tokens per kWh: the one metric for an AI room"
directAnswer: "Tokens per kWh is the number of tokens a server, rack or room produces for each kilowatt-hour it consumes: tokens per second × 3,600 ÷ kilowatts. It puts LLM inference output and the power bill in one number. It is only comparable when you state the boundary: GPU, whole server, rack, or rack plus its share of facility overhead."
calculator: "tokens-per-kwh"
section: "guides"
order: 4
faq: [{"q": "How do I convert joules per token to tokens per kWh?", "a": "Divide 3,600,000 by the joules per token. At 0.5 J per token, that is 7.2 million tokens per kWh."}, {"q": "Is tokens per watt the same as tokens per kWh?", "a": "Same idea, different unit. \"Tokens per watt\" usually means tokens per second per watt, which is tokens per joule. Multiply by 3,600,000 for tokens per kWh."}, {"q": "How do I calculate cost per million tokens from power?", "a": "Divide 1,000,000 by tokens per kWh to get kWh per million tokens, then multiply by your tariff. At 3.75 million tokens per kWh and $0.15/kWh: 0.267 kWh and $0.04. Energy only."}, {"q": "Which boundary should I report?", "a": "Whole server to compare hardware; rack plus its share of facility overhead for cost and for the room. Always print the boundary next to the number."}, {"q": "Can DC Sim show tokens per kWh for my servers?", "a": "Today the Token layer and the Report show it on the demo data, where the figures are estimated. The Readings sheet can carry your own token and power counters from a monitoring export. Live collection through the agent is on the roadmap."}]
---

## 1. One metric, four names

The same idea is searched for in four ways:
- **Energy per token:** joules per token (J/token). Lower is better.
- **Tokens per watt:** usually tokens per second per watt. A watt is a joule per second, so this is tokens per joule.
- **Tokens per kWh:** tokens per joule × 3,600,000, because 1 kWh = 1,000 W × 3,600 s = 3.6 million joules.
- **Cost per million tokens (energy):** kWh per million tokens × your tariff.

Tokens per kWh belongs on the dashboard. It uses the unit on the electricity bill, more is better, and it works for one server or a whole room.

## 2. The conversions, worked

**From joules per token:** tokens per kWh = 3,600,000 ÷ J/token, and kWh per million tokens = J/token ÷ 3.6.

| Joules per token | Tokens per kWh | kWh per 1M tokens |
|---|---|---|
| 0.1 | 36,000,000 | 0.028 |
| 0.25 | 14,400,000 | 0.069 |
| 0.5 | 7,200,000 | 0.139 |
| 1 | 3,600,000 | 0.278 |
| 2 | 1,800,000 | 0.556 |
| 5 | 720,000 | 1.389 |
| 10 | 360,000 | 2.778 |

The table does not say which row your room is in. That depends on model size, precision, concurrency and, above all, where you measure the watts.

**From tokens per second and watts:** tokens per kWh = tokens/s × 3,600,000 ÷ watts. These are example inputs, not benchmarks:

| Tokens/s | Watts | J/token | Tokens per kWh |
|---|---|---|---|
| 500 | 1,000 | 2.0 | 1,800,000 |
| 10,000 | 6,000 | 0.6 | 6,000,000 |
| 10,000 | 9,600 | 0.96 | 3,750,000 |
| 40,000 | 32,000 | 0.8 | 4,500,000 |

Rows two and three are the same server measured at two boundaries. Section 4 explains the gap.

**From tokens per kWh to cost per million tokens:** (1,000,000 ÷ tokens per kWh) × tariff. The tariffs are examples; use your own.

| Tokens per kWh | kWh per 1M tokens | at $0.10/kWh | at $0.15/kWh | at $0.30/kWh |
|---|---|---|---|---|
| 1,000,000 | 1.000 | $0.100 | $0.150 | $0.300 |
| 3,750,000 | 0.267 | $0.027 | $0.040 | $0.080 |
| 6,000,000 | 0.167 | $0.017 | $0.025 | $0.050 |
| 9,000,000 | 0.111 | $0.011 | $0.017 | $0.033 |

At 1 million tokens per kWh, the energy cost of a million tokens equals your tariff. This is energy only: hardware, space, network and staff are not in it.

## 3. A day in numbers

One server producing 10,000 tokens/s, measured at 9,600 W including its share of facility overhead:
- Tokens per day: 10,000 × 86,400 s = 864,000,000.
- Energy per day: 9.6 kW × 24 h = 230.4 kWh.
- Tokens per kWh: 864,000,000 ÷ 230.4 = 3,750,000.
- Energy cost at $0.15/kWh: 230.4 × 0.15 = $34.56 a day, and $34.56 ÷ 864 = $0.04 per million tokens.

The same server measured at the wall, busy for 12 hours at 6,000 W and idle for 12 hours at 2,000 W:
- Tokens: 10,000 × 43,200 s = 432,000,000.
- Energy: 6 kW × 12 h + 2 kW × 12 h = 72 + 24 = 96 kWh.
- Tokens per kWh: 432,000,000 ÷ 96 = 4,500,000, against 6,000,000 while busy.

Idle hours use energy and produce nothing. Measure over a day or a week, not a busy minute.

## 4. The boundary problem

The same server and the same tokens give different numbers depending on where you read the watts. An example server producing 10,000 tokens/s:

| Boundary | What is counted | Watts | J/token | Tokens per kWh |
|---|---|---|---|---|
| GPU package | 8 GPUs × 500 W, as GPU telemetry reports them | 4,000 | 0.40 | 9,000,000 |
| Whole server | plus CPUs, memory, fans, NICs, drives, PSU losses | 6,000 | 0.60 | 6,000,000 |
| Rack | plus its share of switches and PDU losses (400 W) | 6,400 | 0.64 | 5,625,000 |
| Rack + facility share | × PUE 1.5 for cooling, UPS losses, lighting | 9,600 | 0.96 | 3,750,000 |

The GPU figure is 9,000,000 ÷ 3,750,000 = 2.4 times the facility figure. Nothing changed but the meter.

Rules that keep the number honest:
1. Print the boundary next to the number, every time.
2. Compare only numbers taken at the same boundary.
3. To compare servers, use the whole-server boundary. GPU-only numbers hide CPU, memory and fan load.
4. For cost and for the room, use rack plus facility share. That is what the bill sees.
5. A rack's share of PUE is an allocation, not a measurement. Label it **estimated**.

Where the watts come from: a GPU telemetry exporter for the package; the BMC over Redfish, or a metered PDU outlet over SNMP, for the whole server; facility meters over Modbus or BACnet for the overhead. Tokens come from the serving stack's counters.

## 5. Measuring it properly

- **Use counters, not samples.** Over a window, divide the change in the token counter by the change in the energy counter. Watts sampled once a minute miss peaks; an energy counter does not.
- **Align the windows.** Tokens and power must cover the same server and the same minutes.
- **Say which tokens.** Prompt tokens are processed in parallel and usually cost much less energy each than generated tokens. Count generated tokens, or both and say so. Never mix them in one comparison.
- **Hold the workload constant when comparing hardware.** Model size, precision, prompt length and concurrency all move the number. Higher concurrency usually raises it until latency targets stop you.

## 6. What DC Sim shows today

- **Token layer:** tokens/s per server as columns, tokens per kWh as colour across the room. Monitor shows the room's tokens/s and tokens per kWh next to IT kW and PUE.
- **Report:** tokens by workload, tenant, model and server; tokens per kWh; energy, PUE, CO₂ and cost at your tariff.
- **Scenarios:** every scenario reports tokens lost, the tokens/s the affected GPU nodes were producing summed over its duration. Fail a feed or stop a CDU and see the cost in output.

On the demo data, token figures are estimated by the engine from the hardware and workloads in the model, and labelled. The Readings sheet (`time`, `item`, `metric`, `value`) can carry your own counters, such as `tokens_per_s` and `power_w`, from a monitoring export. Live connectors to GPU telemetry and serving-stack exporters, through an outbound agent, are on the roadmap.
