# LiftGen Installation Manual

## Operational Safety and Compliance

**IMPORTANT:** Installation must only be performed by qualified elevator technicians.

### Safety Protocol

1. **Isolate Elevator:** Put the elevator out of service.
2. **Lockout/Tagout (LOTO):** Secure the main power supply and the safety chain during physical mounting.
3. **No Safety Chain Interference:** LiftGen must NEVER be connected to the elevator safety chain.
4. **Work at Height:** Follow all local safety regulations regarding working in the lift shaft and on top of the car.

---

## 1. Component Overview

* **Harvesting Nodes:** Mounted to guide shoes, cabin frame, and counterweights.
* **Energy Hub:** Central aggregation unit usually mounted in the controller cabinet auxiliary area.
* **Conditioning Cables:** 2‑wire shielded cables connecting nodes to the hub.

---

## 2. Installation Procedures

### 2.1 Mounting Harvesting Nodes

**Guide Shoe Nodes (GS Series)**

1. Attach to the side of the guide shoe housing using the provided vibration‑dampening brackets.
2. Ensure the piezoelectric element is in firm contact with the housing surface.

**Cabin Frame Nodes (CF Series)**

1. Mount to the main crosshead or floor channel.
2. Clean the mounting surface thoroughly.
3. Secure using high‑strength industrial adhesive or M6 bolts.

**Counterweight Nodes (CW Series)**

1. Attach to the counterweight frame.
2. Verify that installation does not interfere with guide rail clearance or travel path.

---

### 2.2 Hub Installation

Mount the **LiftGen Energy Hub** inside the auxiliary compartment of the elevator control panel.

Installation guidelines:

* Maintain **100 mm minimum clearance** for ventilation.
* Secure using **DIN rail clips or mounting screws**.
* Ensure accessibility for maintenance and telemetry access.

---

### 2.3 Wiring and Cabling

1. Route all node cables through existing or newly installed protective trunking.
2. Maintain separation from high‑voltage motor lines to reduce electromagnetic interference (EMI).
3. Connect node pairs to the designated **summing diode inputs** in the Energy Hub.
4. Ensure cable shielding is grounded according to installation guidelines.

---

## 3. Commissioning Checklist

| Step | Action              | Expected Result                                                     |
| ---- | ------------------- | ------------------------------------------------------------------- |
| 1    | Visual Inspection   | All nodes secure and cables properly routed                         |
| 2    | Isolation Test      | Infinite resistance between LiftGen and lift safety chain           |
| 3    | Static Voltage Test | Supercapacitor voltage >12V if pre‑charged                          |
| 4    | Motion Test         | After 3 lift cycles, hub voltage increases                          |
| 5    | Telemetry Check     | Connect to LiftGen_AP and access telemetry at 192.168.4.1/telemetry |

---

## 4. Maintenance

**Quarterly Inspection**

* Check node mounting brackets
* Verify cable integrity
* Inspect vibration dampers

**Annual Inspection**

* Review LiFePO4 battery health through telemetry portal
* Verify supercapacitor capacity
* Check firmware updates for telemetry gateway

**Emergency Removal**

If the system must be removed or isolated:

1. Disconnect node inputs from the Energy Hub.
2. Remove hub power connectors.
3. Leave harvesting nodes mechanically mounted if removal is not required.

The elevator will continue normal operation because LiftGen functions as a passive auxiliary system.

---

## System Principle

LiftGen operates as a **non‑operational auxiliary energy harvesting platform**. It captures mechanical vibration energy and converts it into stored electrical energy used for telemetry and auxiliary micro‑loads. The system remains electrically isolated from the elevator control and safety architecture at all times.
