# LiftGen System Architecture — **v3 (Utility-Scale Grid)**

LiftGen is an **industrial-grade distributed elevator energy harvesting microgrid**. This version (v3) introduces a **utility-scale SCADA monitoring model**, integrating high-precision frequency tracking, ESG reporting, and command-level breaker overrides for multi-lift shaft environments.

---

# High-Level Energy Flow (v2)

```mermaid
graph TD

subgraph Elevator_Dynamics
    A1[Guide Rail Friction]
    A2[Cabin Structural Vibration]
    A3[Counterweight Motion]
    A4[Buffer Compression]
end

subgraph Harvesting_Nodes
    N1[Guide Shoe Node]
    N2[Cabin Frame Node]
    N3[Counterweight Node]
    N4[Buffer Node]
end

subgraph Conditioning
    C1[AC/DC Rectifier]
    C2[Pulse Stabilization]
    C3[Input Capacitor Bank]
end

subgraph LiftGen_Energy_Hub
    SUM[Schottky Diode Combiner]
    SC[Supercapacitor Array]
    BMS[Battery Charge Controller]
    BATT[LiFePO4 Storage Bank]
end

subgraph Power_Distribution
    REG[DC Regulation & Isolation]
    BUS[Optional Lift DC Bus Support]
end

subgraph Building_Applications
    TL[Telemetry Gateway]
    AUX[Elevator Aux Systems]
    BLD[Building Micro Loads]
end

A1 --> N1
A2 --> N2
A3 --> N3
A4 --> N4

N1 --> C1
N2 --> C1
N3 --> C1
N4 --> C1

C1 --> C2
C2 --> C3
C3 --> SUM

SUM --> SC
SC --> BMS
BMS --> BATT

BATT --> REG
REG --> TL
REG --> AUX
REG --> BLD
REG --> BUS
```

---

# Hardware Interaction Model (v2)

```mermaid
graph LR

subgraph Harvesting_Node
    PG[Piezo / Micro Generator]
    RECT[Bridge Rectifier]
    BUF[Buffer Capacitor]
end

subgraph Energy_Hub
    SUM[Schottky Summing Diodes]
    SUP[Supercapacitor Bank]
    CHG[LiFePO4 Charge Controller]
    BAT[LiFePO4 Battery Pack]
end

subgraph Control_System
    REG[DC Voltage Regulation]
    MCU[Telemetry MCU]
    COM[Ethernet / RS485 / LoRa]
end

PG --> RECT
RECT --> BUF
BUF --> SUM
SUM --> SUP
SUP --> CHG
CHG --> BAT
BAT --> REG
REG --> MCU
MCU --> COM
```

---

# Lift DC Bus Integration (Future Mode)

This is the piece you hinted at earlier — **using stored energy to assist the lift system**.

```mermaid
graph TD

subgraph LiftGen_Power_Grid
    BAT[LiFePO4 Storage]
    REG[DC Regulation]
    ISO[Galvanic Isolation]
    BRK[SCADA Breaker Matrix]
end

subgraph Lift_System
    DCBUS[Elevator Drive DC Bus]
    VFD[Motor Drive Inverter]
    MOTOR[Traction Motor]
end

subgraph Monitoring_Control
    SCADA[Grid Portal v4]
    CMD[Maintenance Console]
end

BAT --> REG
REG --> ISO
ISO --> BRK
BRK --> DCBUS
DCBUS --> VFD
VFD --> MOTOR

SCADA -.-|Telemetry| BRK
CMD -.-|Overrides| BRK
```

Important engineering reality:

This would **not run the elevator motor fully**.
But it could:

• assist low-power DC bus electronics
• reduce standby draw
• support regenerative events
• smooth voltage dips

Think of it as **micro-support**, not full propulsion.

---

# Safety Isolation Layout

```mermaid
graph TD

subgraph Elevator_Safety_Chain
    S1[Door Interlocks]
    S2[Overspeed Governor]
    S3[Safety Relay]
    S4[Main Lift Controller]
end

subgraph LiftGen_System
    LG1[Energy Harvest Nodes]
    LG2[Energy Hub]
    LG3[Aux Power Outputs]
end

S4 -.-|Mechanical Only| LG1
S4 -.-|Electrical Isolation| LG2
```

LiftGen never touches:

* brake circuits
* door locks
* safety relays
* governor systems

That separation is **non-negotiable in elevator engineering**.

---

# What Changed in **v3**

Major upgrades from the v2 architecture:

• **Utility-Scale SCADA Portal**: Implementation of a high-density, phosphor-aesthetic grid monitor.
• **High-Precision Telemetry**: Frequency dials (0.001Hz res) and spectral power density analysis.
• **ESG & Carbon Tracking**: Automated calculation of CO2 offsets and carbon credit minting logic.
• **Maintenance Command Console**: Remote breaker overrides (BRK-01/02) for safe isolation during lift maintenance.
• **Phase Balance Monitoring**: Precision tracking of L1/L2/L3 loads to prevent substation stress.

This architecture now represents a **grid-ready infrastructure platform.**
