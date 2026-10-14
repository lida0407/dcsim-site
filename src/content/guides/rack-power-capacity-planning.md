---
title: "Rack power capacity planning with the 80 % rule"
description: "How to plan rack power for a 1–50 rack room: nameplate vs measured watts, derating, A/B feeds, breaker and PDU limits, and the checks that catch the usual mistakes."
h1: "Rack power capacity planning with a spreadsheet and the 80 % rule"
directAnswer: "Rack power capacity planning means knowing, for every rack, how many kilowatts it draws at peak, which feed and breaker carry it, and how much headroom is left under the 80 % rule. For a small room you need three columns per device — rack, model, power cords — and a power sheet with the chain from UPS to PDU. Everything else is arithmetic a tool should do for you."
calculator: "rack-power"
section: "guides"
order: 1
faq: [{"q": "What is the 80 % rule?", "a": "Continuous load on a breaker, PDU or UPS should not exceed 80 % of its rating; the remaining 20 % is for inrush, imbalance and measurement error."}, {"q": "Should I plan with nameplate or measured watts?", "a": "Measured, when you have a week of readings. Until then, a per-model catalog estimate, labelled as such — never a flat percentage of nameplate."}, {"q": "How do I check A/B redundancy across the whole room?", "a": "Fail feed A in a model that knows every cord and every PDU rating, and read the surviving side's load per node. A rack-by-rack spreadsheet cannot see the upstream sums."}, {"q": "Does this apply to a 5-rack server room?", "a": "Especially. Small rooms are where both PDUs end up on the same feed and nobody notices until the electrician's maintenance window."}, {"q": "Can DC Sim do this from my existing spreadsheet?", "a": "If it has rack, U and model per device, yes; rename the headers or keep them — common synonyms are recognised. Add the Power sheet for the chain and the checks run at import."}]
---

## 1. Start with the three numbers that matter per rack

- **Peak draw (kW):** the sum of what the devices in the rack actually pull at their busiest, not the sum of nameplate ratings. Nameplate is what the power supply *can* deliver; most servers run at 40–70 % of it. If you have measured values (PDU outlet readings, Redfish power, a Zabbix item in watts), use them. If not, use a catalog estimate per model and label it **estimated**.
- **Feed and breaker:** which PDU, which panel breaker, which UPS module and which feed (A or B) each cord goes to. A rack with two PDUs on the same feed is a single point of failure dressed as redundancy.
- **Headroom under the 80 % rule:** a breaker is continuously loaded to 80 % of its rating at most (a 32 A breaker at 230 V single-phase carries 7.36 kW; 80 % of that is 5.9 kW). The same rule applies to PDU input ratings and to the UPS.

## 2. Why "nameplate ÷ 2" is not a plan

Derating by a fixed factor hides the two cases that cause outages: the rack of storage nodes that really does run near nameplate during rebuilds, and the GPU rack whose nodes idle at a quarter of nameplate until a job starts. Plan with per-model estimates, then replace them with measured values as soon as you have a week of readings.

## 3. The spreadsheet (and why the columns are what they are)

The DC Sim template uses the minimum set:
- **Devices:** `rack`, `u`, `model`, optional `power_cords` (A, B or AB). The model gives the catalog power estimate; the cords give the feeds.
- **Power:** `name`, `type` (utility, generator, ATS, UPS, panel, breaker, PDU), `rating` (kW, kVA or A with `voltage` and `phases`), `fed_from`, `feed` (A/B), `rack`.
- **Cables** of type power (optional, when you want exact PSU → outlet mapping): `from_device`, `from_port` (PSU1), `to_device` (PDU), `to_port` (outlet 3).
From these three sheets a tool can build the one-line diagram, sum the load on every node, apply the 80 % rule and flag the rest.

## 4. The checks that catch the usual mistakes

1. **Node over 80 %** — any breaker, PDU or UPS above 80 % of its rating at planned load.
2. **Same-feed PSUs** — both cords of a dual-corded device on the same feed (often both on A because the B PDU was "temporarily" full).
3. **Single-corded devices** — anything with one cord on a rack that is supposed to be 2N.
4. **UPS runtime under 5 minutes** at current load — enough for an orderly shutdown, or not.
5. **Rack over its kW budget** — the `max_kw` in the Racks sheet, set by cooling as much as by power.
6. **Heat above cooling** — the sum of rack kW in a cooling zone against the cooling capacity that serves it (estimated).
In DC Sim these run at import and are pinned in 3D; the Power layer's **Fail** button then shows what happens when the node you worried about actually fails.

## 5. A/B feeds: what 2N really requires

Two PDUs per rack are necessary, not sufficient. For a rack to survive the loss of feed A: every device needs a cord on B; the B PDU must carry the whole rack under 80 %; the B path upstream (panel, UPS, feed) must do the same for every rack on it. The last condition is the one spreadsheets miss, because it is a sum across racks. Fail feed A in the model and read the surviving PDU's load: that is the number.

## 6. Planning the next row (GPU or otherwise)

Add the planned devices to the sheet with their catalog estimates, re-run the checks, and look at three things: the PDU and breaker percentages on the new row, the UPS load (and runtime, estimated), and the cooling zone's heat versus capacity. If any crosses 80 %, the plan needs a breaker, a PDU, a cooler, or fewer nodes — in that order of cost.

## 7. Keep it alive

A capacity plan is wrong the day a server is moved. Re-upload the sheet after every change and read the change list; add measured power to the Readings sheet so the model fits your room, and live connectors (on the roadmap) will keep it current.
