# LiftGen Gen2 Hardware: Bill of Materials (BOM)

This document details the primary components required for the construction and deployment of a Gen2 LiftGen Harvesting Node and Aggregator Hub.

## 1. Harvesting Node (Per Unit)
The Harvesting Node is responsible for local energy capture and telemetry.

| Category | Component | Specification | Quantity | Primary Source |
| :--- | :--- | :--- | :--- | :--- |
| **Logic** | ESP32 Dev Module | Dual Core, 240MHz, WiFi/BLE | 1 | Espressif |
| **Sensing** | MPU6050 IMU | 6-Axis Accelerometer/Gyro | 1 | InvenSense |
| **Sensing** | Hall Effect Sensor | AH3572 High Sensitivity | 2 | Diodes Inc. |
| **Power** | Supercapacitor Bank | 50F, 5.5V (Balanced) | 1 | Eaton |
| **Power** | DC-DC Converter | Buck-Boost (1.8V-5.5V to 3.3V) | 1 | TI (TPS63020) |
| **Enclosure** | Industrial ABS Shell | IP65 Rated, Magnetic Mount | 1 | Hammond |

## 2. Aggregator & Energy Hub
The central hub for multi-node aggregation and DC bus injection.

| Category | Component | Specification | Quantity | Primary Source |
| :--- | :--- | :--- | :--- | :--- |
| **Logic** | ESP32-S3 | Integrated WiFi/BLE, High IO | 1 | Espressif |
| **Storage** | LiFePO4 Battery | 24V, 10Ah (Deep Cycle) | 1 | EcoFlow / Generic |
| **Power** | Bi-Directional Converter | 24V DC Bus Interface | 1 | Mean Well |
| **Safety** | Mechanical Breaker | 10A DC rated | 2 | Schneider Electric |
| **Display** | 0.96" OLED | I2C, 128x64 (Local Status) | 1 | Adafruit |

## 3. Mounting & Physical
| Component | Description | Quantity |
| :--- | :--- | :--- |
| Neodymium Magnets | N52 Grade, for non-invasive mounting | 4 per node |
| High-Flex Ribbon Cable | For Node-to-Hub connectivity | As req |
| 3M VHB Tape | Heavy-duty industrial adhesive | As req |

## 4. Total Project Estimates (Prototype Phase)
- **Single Node Cost (Est.)**: Ksh. 7,000
- **Hub Cost (Est.)**: Ksh. 21,000
- **Total System (4 Nodes + Hub)**: Ksh. 49,000

---
*Note: Prices are estimates based on low-volume prototype purchasing.*
