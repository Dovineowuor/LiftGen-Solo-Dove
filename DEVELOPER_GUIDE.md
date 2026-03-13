# LiftGen Developer Guide

Welcome to the LiftGen development environment! This guide provides instructions for setting up your local environment to contribute to the LiftGen energy‑harvesting platform.

---

# Project Structure

/firmware/LiftGen_Node — ESP32 Arduino source code

/telemetry-web — HTML, CSS, and JavaScript source for the telemetry dashboard

/docs — Architecture documents, whitepapers, and investor briefs

/hardware — (Planned) PCB layouts and mechanical designs

---

# 1. Firmware Development (ESP32)

LiftGen nodes run on the ESP32 platform using the Arduino framework.

## Prerequisites

Required tools:

• Arduino IDE
• VS Code with PlatformIO

ESP32 Board Support:

Add the following URL to the Arduino "Additional Boards Manager URLs":

[https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json](https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json)

Required Libraries:

ESPAsyncWebServer
AsyncTCP
arduinoFFT (used for vibration spectral analysis in production builds)

---

## Configuration

Edit the configuration file:

firmware/LiftGen_Node/config.h

Parameters available for configuration include:

• WiFi SSID and password
• Hardware pin mappings for the ESP32 development board
• Sensor sampling frequency
• Calibration constants for vibration and energy sensors

Example configuration:

#define WIFI_SSID "LiftGen_AP"
#define WIFI_PASSWORD "liftgen123"

#define VIBRATION_SENSOR_PIN 34
#define GENERATOR_INPUT_PIN 35

#define SAMPLE_RATE 1000

---

## Flashing Firmware

1. Open the file:

firmware/LiftGen_Node/LiftGen_Node.ino

2. Select the correct board (for example: ESP32 Dev Module).

3. Connect the ESP32 board via USB.

4. Click Upload in the Arduino IDE or run the upload task in PlatformIO.

After flashing, the device will create a local access point for telemetry testing.

---

# 2. Telemetry Dashboard Development

The telemetry dashboard is a lightweight web interface built using modern CSS and Vanilla JavaScript.

It visualizes vibration data, harvested energy, and node health metrics.

---

## Local Development Setup

1. Navigate to the telemetry-web directory.

2. Open index.html directly in a browser for quick testing.

For a proper development environment with live reload, run a local web server.

Example using Python:

python3 -m http.server 8000

Then open:

[http://localhost:8000](http://localhost:8000)

---

## Dashboard Architecture

index.html

Main layout and data containers.

style.css

Defines visual tokens and styling variables under the :root selector.

app.js

Handles telemetry simulation, chart rendering, and WebSocket communication.

In production, simulation data will be replaced with a WebSocket client connected to the ESP32 telemetry gateway.

---

# 3. Documentation System

All LiftGen documentation is written using Markdown.

This allows easy version control and compatibility with Git repositories and documentation generators.

Key documentation locations:

/docs/whitepaper/technical_whitepaper.md

Contains the main engineering whitepaper describing the LiftGen architecture and energy harvesting theory.

/docs/architecture.md

Contains system diagrams and architecture definitions.

Supports Mermaid diagrams for visual system modeling.

---

# 4. Contribution Guidelines

LiftGen is designed around strict safety and engineering principles.

All contributions must follow these guidelines.

---

## Safety First

LiftGen must always remain:

• Non-operational
• Electrically isolated
• Independent from elevator safety systems

Under no circumstances should the system connect to the elevator safety chain or modify lift control electronics.

Any modifications to energy routing or electrical interfaces must be reviewed for EN‑81 safety compliance.

---

## Code Style

Firmware (Arduino / C++):

Use CamelCase for functions.

Example:

ReadVibrationSensor()

Use PascalCase for classes.

Example:

class LiftGenNode

---

Frontend (JavaScript / CSS):

Use modern ES6+ syntax.

Follow BEM-like CSS naming conventions.

Example:

.dashboard__panel
.dashboard__chart

---

# 5. Architecture Alignment

All new modules should follow LiftGen Architecture v2 principles.

Core ideas include:

• Distributed energy harvesting nodes
• Centralized energy aggregation hub
• Hybrid storage (supercapacitors plus LiFePO4)
• Telemetry-first system design

The goal is to treat the elevator environment as a distributed micro‑energy network rather than a single generator.

---

# Development Philosophy

LiftGen is designed to explore a simple but powerful idea:

Existing infrastructure contains untapped energy.

By combining embedded systems, energy harvesting hardware, and telemetry analytics, LiftGen converts that overlooked mechanical activity into both electrical power and operational insight.

Developers contributing to the platform are encouraged to think in terms of distributed sensing, resilient design, and strict safety isolation from elevator control systems.

---

# 6. Firmware Architecture

LiftGen firmware follows a modular layered architecture to ensure reliability, maintainability, and safe separation between sensing, power measurement, and communication subsystems.

## Sensor Driver Layer

The sensor layer interfaces directly with hardware components connected to the ESP32. These drivers are responsible for sampling raw signals and performing initial filtering.

Typical sensors include:

• Piezoelectric vibration transducers
• Electromagnetic micro‑generator inputs
• Voltage sensors for storage monitoring
• Optional temperature and environmental sensors

Responsibilities of the sensor driver layer:

• Analog signal acquisition via ESP32 ADC
• Signal conditioning and filtering
• Timestamped sampling
• Providing normalized data to upper modules

Recommended structure:

firmware/LiftGen_Node/

sensors/

VibrationSensor.cpp
EnergyInputSensor.cpp
StorageVoltageSensor.cpp

Each driver should expose a simple interface such as:

ReadSensor()
GetFilteredValue()

---

## Energy Measurement Module

The energy measurement module converts raw electrical signals from harvesting nodes into usable metrics.

Measured parameters include:

• Instantaneous voltage
• Estimated current
• Calculated power
• Cumulative harvested energy (Wh)

Typical calculations performed:

Power = Voltage × Current

Energy accumulation is integrated over time to produce total harvested energy values.

Example module layout:

energy/

EnergyCalculator.cpp
EnergyStorageMonitor.cpp

Output metrics are forwarded to the telemetry subsystem.

---

## Telemetry Stack

The telemetry system provides communication between LiftGen nodes and the dashboard interface.

Core functions include:

• Local WiFi access point for commissioning
• HTTP API endpoints
• Optional WebSocket real‑time streaming
• JSON data formatting

Telemetry responsibilities:

• Publish sensor data
• Report node health
• Provide system diagnostics

Suggested module structure:

telemetry/

TelemetryServer.cpp
TelemetryRoutes.cpp
WebSocketHandler.cpp

The ESP32 acts as a lightweight telemetry gateway during development and testing.

---

## OTA Update Support

LiftGen firmware supports Over‑The‑Air (OTA) updates to simplify maintenance and field upgrades.

OTA allows technicians to deploy firmware improvements without removing hardware from the elevator system.

OTA subsystem responsibilities:

• Secure firmware upload
• Version verification
• Safe firmware swap
• Rollback on update failure

Typical libraries used:

ArduinoOTA
ESPAsyncWebServer

OTA updates should only be enabled when the elevator system is in maintenance mode.

---

# 7. API Specification

LiftGen nodes expose a lightweight HTTP API used by the telemetry dashboard and external monitoring systems.

All responses are formatted as JSON.

---

## Endpoint: /telemetry

Returns real‑time system telemetry.

Example response:

{
"node_id": "LGN-001",
"vibration_rms": 0.42,
"harvest_power_mw": 85,
"energy_wh": 12.6,
"battery_soc": 0.73,
"timestamp": 1710000000
}

Fields:

node_id — unique node identifier
vibration_rms — measured vibration intensity
harvest_power_mw — instantaneous harvested power
energy_wh — cumulative harvested energy
battery_soc — battery state of charge

---

## Endpoint: /nodes

Returns a list of nodes detected by the LiftGen hub.

Example response:

{
"nodes": [
{
"id": "LGN-001",
"type": "GuideShoe",
"status": "online"
},
{
"id": "LGN-002",
"type": "CabinFrame",
"status": "online"
}
]
}

This endpoint is primarily used by the dashboard to display system topology and node health.

---

## Endpoint: /health

Provides system diagnostics.

Example response:

{
"system_status": "OK",
"firmware_version": "0.2.1",
"uptime_seconds": 86400
}

---

# Development Roadmap

LiftGen development progresses through several stages:

Prototype Phase

Basic harvesting nodes and telemetry validation.

Field Pilot

Installation on a real elevator shaft with monitored performance.

Production System

Fully integrated node network with predictive maintenance analytics.

Long‑term research focuses on improving harvesting efficiency, expanding telemetry analytics, and integrating LiftGen data with smart building platforms.
