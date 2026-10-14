---
title: "Sample data center twin built from an Excel file — DC Sim"
description: "The demo hall: racks, PDUs, UPS A/B, cooling units, cables and GPU nodes, all from one spreadsheet you can download and change."
h1: "The sample twin"
navLabel: "Sample twin"
directAnswer: "The sample twin is a demo hall built from one Excel file through the same importer customers use: two rows of racks with servers, switches, storage and GPU nodes, A and B PDUs fed by two UPS modules behind an ATS, three cooling units and several hundred cables. Download the file, change a row, and that is the file we import in a walkthrough."
section: "resources"
order: 2
shots:
  - { name: "overview", alt: "The demo hall in 3D: two rows of racks, three cooling units along one wall, UPS and panel cabinets, with the View menu and time slider.", caption: "Overview: the demo hall as imported from demo-hall.xlsx." }
  - { name: "power-diagram", alt: "One-line power diagram of the demo hall from utility and generator through the ATS, two UPS units and two panels to the rack PDUs, with load bars.", caption: "Power: the one-line diagram built from the Power sheet and the power cables." }
  - { name: "cabling", alt: "Cabling view of the demo hall with power, network, storage and console cables routed through trays, and the cable filter open.", caption: "Cabling: every row of the Cables sheet as a routed run." }
  - { name: "network-fail", alt: "Network topology of the demo hall with spine-01 failed and a banner listing devices that lose every network path.", caption: "Network: fail spine-01 and see who loses every path." }
  - { name: "air-topdown", alt: "Top-down Air view of the demo hall with an inlet temperature heat map.", caption: "Air: inlet temperatures from the zonal model, labelled estimated." }
  - { name: "phone", alt: "DC Sim on a phone: the demo hall in 3D with the View menu, import button and time slider.", caption: "The same twin on a phone." }
faq: [{"q": "Is the sample real data?", "a": "No. It is a synthetic room generated to exercise every layer; the device models in it are real catalog entries."}, {"q": "Can I open the demo myself?", "a": "Not yet: a public demo of the English edition is on the roadmap. Today we show it, and your own file, in a walkthrough."}, {"q": "Why does the Air layer say \"estimated\"?", "a": "Because the sample has no real sensors: the zonal model projects temperatures from the cooling capacity and the rack heat, and says so."}]
---

## What a walkthrough shows

- The demo hall in the browser: the View menu, the time slider, Design, Monitor, Simulate and Replay.
- **UPS-A, Fail** in the Power diagram: read the banner, then **Simulate it** for the timeline.
- Cabling: pick a cable and **Trace** it through the patch panel.
- Network: fail the spine switch and see who keeps a path.
- Device: open a GPU node in its rack and take it apart.
- Then the same with your own file.

## Other demo rooms

An edge room (one row, two PDUs, one cooling unit) and a 96-rack hall with a liquid-cooled GPU row (CDU, manifolds, a leak scenario). Partners present from these.

## The file

[Download demo-hall.xlsx](/downloads/demo-hall.xlsx): the filled template behind this twin. Change a row and the change list on re-import shows exactly what moved.
