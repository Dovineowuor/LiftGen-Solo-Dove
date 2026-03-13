# LiftGen: Elevator Energy Harvesting & Telemetry

**LiftGen** is an auxiliary energy harvesting system designed to capture and store micro-energy from elevator mechanical dynamics (vibration, friction, and movement).

The system converts ambient mechanical energy into usable DC power using piezoelectric harvesters and micro-generators, providing both energy for auxiliary building systems and critical telemetry for predictive maintenance.

---

## 🚀 Project Hub

### For Engineers & Developers
*   [**Developer Guide**](./DEVELOPER_GUIDE.md) — Environment setup, flashing instructions, and grid-spec guidelines.
*   [**Architecture v3**](./docs/architecture.md) — SCADA modeling, grid energy flow, and DC bus integration.
*   [**Technical Whitepaper**](./docs/whitepaper/technical_whitepaper.md) — Harvesting physics and utility-scale engineering.
*   [**Installation Manual**](./docs/INSTALLATION_MANUAL.md) — Field deployment and safety commissioning.
*   [**Hardware BOM**](./hardware/BOM.md) — Detailed bill of materials for Gen2 nodes.

### For Stakeholders
*   [**Investor Brief**](./docs/brief/investor_brief.md) — High-level value proposition and sustainability (ESG) impact.
*   [**Project Vision**](./PROJECT_DESC.md) — The core philosophy and future goals.

---

## 📦 System Overview

1.  **Distributed Harvesting Nodes**: Installed on guide shoes, cabin frames, and counterweights.
2.  **Energy Hub**: Aggregates conditioning logic and hybrid storage (LiFePO4 + Superconductors).
3.  **Grid Portal Dashboard**: [v4 SCADA Interface](./telemetry-web/index.html) with utility-scale monitoring.
4.  **ESP32 Firmware**: [Node Logic](./firmware/LiftGen_Node/LiftGen_Node.ino) including state machines and FFT analysis.

---

## 🛡️ Safety Philosophy

LiftGen follows a strict **non-operational, non-safety related** design:
*   NO interference with the primary lift drive or safety chain.
*   Electrically isolated from all safety-critical circuits (EN 81 series compliant).
*   Passive fail-safe: The elevator remains 100% operational if LiftGen is disabled.

---

## 🛠️ Installation & Maintenance

Installation should only be performed by qualified technicians. Detailed workflows and commissioning checklists are available in the **Installer Handbook** (Internal).

---

## 📜 License & Maintainers

*   **Maintainers**: Dovetec Enterprises — LiftGen Engineering Team.
*   **License**: Project license to be defined (Proprietary/Open-Telemetry).

