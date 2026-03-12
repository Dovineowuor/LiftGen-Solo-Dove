# LiftGen Installation Manual

## Operational Safety and Compliance

**IMPORTANT**: Installation must only be performed by qualified elevator technicians.

### Safety Protocol
1.  **Isolate Elevator**: Put the elevator out of service.
2.  **Lockout/Tagout (LOTO)**: Secure the main power supply and the safety chain during physical mounting.
3.  **No Safety Chain Interference**: LiftGen must NEVER be connected to the elevator safety chain.
4.  **Work at Height**: Follow all local safety regulations regarding working in the lift shaft and on top of the car.

---

## 1. Component Overview

*   **Harvesting Nodes**: Mounted to guide shoes, cabin frame, and counterweights.
*   **Energy Hub**: CentralAggregation unit usually mounted in the controller cabinet auxiliary area.
*   **Conditioning Cables**: 2-wire shielded cables connecting nodes to the Hub.

---

## 2. Installation Procedures

### 2.1 Mounting Harvesting Nodes
1.  **Guide Shoe Nodes (GS Series)**: Attach to the side of the guide shoe housing using the provided vibration-dampening brackets. Ensure the piezoelectric element is in contact with the housing.
2.  **Cabin Frame Nodes (CF Series)**: Mount to the main crosshead or floor channel. Clean the surface and use high-strength industrial adhesive or M6 bolts.
3.  **Counterweight Nodes (CW Series)**: Attach to the counterweight frame, ensuring no interference with the guide rails.

### 2.2 Hub Installation
Mount the **LiftGen Energy Hub** in the auxiliary compartment of the elevator control panel.
*   Ensure 100mm clearance for ventilation.
*   Secure using DIN rail or mounting screws.

### 2.3 Wiring & Cabling
1.  Route all node cables through existing or new protected trunking.
2.  Maintain separation from high-voltage motor lines to prevent EMI.
3.  Connect node pairs to the summing diodes in the Energy Hub.

---

## 3. Commissioning Checklist

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| 1 | Visual Inspection | All nodes secure; no loose wires. |
| 2 | Isolation Test | Infinite resistance between LiftGen and Lift Safety Chain. |
| 3 | Static Voltage | Check supercapacitor storage voltage (should be >12V if pre-charged). |
| 4 | Motion Test | Run the lift for 3 cycles; verify voltage increase in the hub. |
| 5 | Telemetry | Connect to "LiftGen_AP" and verify node data at `192.168.4.1/telemetry`. |

---

## 4. Maintenance

*   **Quarterly**: Inspect mounting points for loosening due to vibration.
*   **Annually**: Check LiFePO4 battery health through the telemetry portal.
*   **Emergency**: If the system must be removed, simply disconnect the node inputs from the hub. The elevator will continue standard operation.
