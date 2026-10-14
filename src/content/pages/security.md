---
title: "Security and data handling: DC Sim"
description: "Tenant isolation, outbound-only agent, EU and China hosting regions, redaction, no training on customer data, export and delete on request."
h1: "Security & data"
directAnswer: "DC Sim holds a model of your room, not your network. The browser receives rendered frames; the simulation engine, the importer and your data stay server-side in an isolated tenant. Live data arrives through an agent that only dials out. You can export your model and history, and ask for deletion, at any time."
navLabel: "Security & data"
section: "company"
order: 2
faq: [{"q": "Can the twin be installed on-premises?", "a": "The same container runs on-prem and is part of the Enterprise license (later). Ask if you need it earlier."}, {"q": "What will the agent send?", "a": "When live connectors ship: metric names, values, timestamps and the host label, nothing else. A dry-run flag prints exactly what would be sent before it connects anywhere."}, {"q": "Who can see my room?", "a": "Today, during a walkthrough, only you and Sensaka. In the product: your users and the partners you invite; Sensaka support only with your permission during a ticket."}, {"q": "Do you keep my spreadsheet?", "a": "The values are turned into your model. Ask us to delete the model and the original file and we will confirm in writing within 30 days. Model export as a filled template is on the roadmap."}, {"q": "Is customer data used to improve the catalog?", "a": "Only if you choose to contribute a spec sheet, and then only the public facts from it with the source cited."}]
---

## Architecture, in five lines

1. **Browser:** receives frames and diagrams; the web bundle contains no secrets and no engine code.
2. **Server:** the simulation engine, the importer and the catalog run on the server; each customer is a separate organisation with its own sites, versions and history.
3. **Agent (with live connectors, on the roadmap):** a single binary inside your network that polls your sources and sends metric values over one outbound WebSocket. No listening port. Credentials stay in its config file on your machine.
4. **Storage:** model and readings in a Postgres-compatible database per deployment.
5. **Editions:** the English edition is Sensaka's, hosted in the EU; the Chinese-language edition is operated by CloudSino in China. The two do not share data.

## What we do with your files and data

- **Excel/CSV import:** parsed server-side, values only. Formulas are never evaluated; macro-enabled, encrypted and zip-bomb files are refused; 10 MB per file, 50,000 rows per sheet.
- **Manuals and spec sheets you send for the catalog:** only the facts (size, weight, power, parts) are stored, with the source cited; the document itself is not kept beyond extraction unless you opt in.
- **No training on customer data.** Your model, telemetry and files are not used to train any model, ours or a third party's. The AI design assistant (roadmap) will see only the catalog and the brief you type.
- **Redaction (on request):** before a shared walkthrough, a case study or a support session, device names, owners and tenant names are replaced by placeholders.
- **Delete:** deletion requests for your model and files are honoured within 30 days. Model export as a filled template is on the roadmap.

## Access

Today the product runs in walkthroughs on our servers, with demo data and the files you send. Self-serve accounts are on the roadmap; the product already separates organisations, users and roles, and a partner's access to a customer's site is by invitation and can be revoked by the customer. SSO (SAML/OIDC) is part of Enterprise (later). All traffic is TLS; the agent will use WSS.

## What we do not do

- We do not require inbound ports, VPNs or appliances.
- We do not control anything: the agent reads; the twin simulates; nothing writes back to your UPS, PDU or BMS.
- We do not sell or share your data. Logos and names of customers appear only with written permission.

## Hosting and compliance, plainly

EU hosting for the Sensaka edition. Backups per deployment. A written security summary, a data-processing addendum and the sub-processor list are available on request. Certifications are not claimed; ask and we will tell you exactly what is and is not in place.
