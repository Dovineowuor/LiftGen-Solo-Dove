# LiftGen Project — Elevator Energy Harvesting & Optimization System

**LiftGen** is a retrofit energy‑harvesting and optimization platform designed for elevators. Its purpose is to capture wasted mechanical energy from lift motion, store it intelligently, and reuse it to power elevator systems, building loads, and telemetry infrastructure.

Every elevator moves significant mass thousands of times per day. LiftGen converts part of that motion into usable electricity instead of letting it dissipate as vibration, friction, and heat.

---

# Core Concept

Elevators continuously produce mechanical energy through:

• Guide rail friction
• Cabin vibration
• Counterweight motion
• Buffer compression
• Structural oscillations

LiftGen installs distributed energy harvesting nodes throughout the lift shaft to convert those mechanical effects into electrical energy.

The harvested energy is then:

1. Harvested
2. Stored
3. Optimized
4. Reused

The elevator operates normally even if LiftGen is disconnected. The system is intentionally non‑operational and non‑safety related.

---

# System Architecture

LiftGen functions as a distributed micro‑energy system inside the elevator infrastructure.

## Energy Harvesting Nodes

Nodes are installed at strategic mechanical points:

• Lift shoe nodes (guide rail friction)
• Cabin floor nodes (vibration)
• Counterweight nodes (vertical motion)
• Buffer nodes (impact compression)

These nodes use:

• Piezoelectric generators
• Micro linear generators
• Vibration harvesters

Mechanical movement is converted into low‑voltage electrical energy.

---

# Energy Aggregation

Harvested energy flows to the **LiftGen Energy Hub**.

Inside the hub:

• Schottky diode combiners merge input sources
• Supercapacitors absorb fast energy spikes
• Battery storage provides longer‑term retention

Two storage technologies are used.

**Supercapacitors**

• extremely fast charge and discharge
• ideal for motion spikes

**LiFePO₄ batteries**

• long duration storage
• safe chemistry
• supports backup power

---

# Energy Reuse

Stored energy can power several systems.

## Elevator Systems

• control electronics
• cabin lighting
• ventilation
• auxiliary loads

## Building Systems

• corridor lighting
• building sensors
• building management systems
• emergency micro‑loads

## DC Bus Support

In advanced configurations the system may supplement the lift drive DC bus to reduce grid draw during peak loads.

---

# Telemetry and Intelligence Layer

LiftGen also operates as a distributed sensor network for elevator health monitoring.

Each node can report:

• vibration levels
• energy harvested per trip
• component wear patterns
• system health metrics

Telemetry is transmitted through a gateway and visualized via monitoring dashboards.

This enables:

• predictive maintenance
• ride quality monitoring
• energy analytics
• operational optimization

---

# Safety Philosophy

Elevator engineering follows a strict principle: safety systems must never be compromised.

LiftGen respects this principle completely.

The system:

• does not control the motor
• does not affect braking
• does not interact with door locks
• does not interfere with safety circuits

The platform remains electrically isolated from safety‑critical components. If LiftGen fails, the elevator continues operating normally.

---

# Key Benefits

## Energy Efficiency

Captures energy that would otherwise be wasted.

## Reduced Operating Costs

Reduces electricity consumption for elevators and supporting loads.

## Backup Power Capability

Stored energy can maintain essential electronics during outages.

## Predictive Maintenance

Continuous telemetry improves reliability and service planning.

## Retrofit Friendly

Designed to install on existing elevators without modifying core lift controls.

---

# Long‑Term Vision

LiftGen transforms elevators from pure energy consumers into micro energy producers.

In buildings with multiple elevators the system becomes a distributed energy network that:

• harvests motion energy
• stores it locally
• redistributes it intelligently

Over time elevators become part of the building's broader energy ecosystem rather than simply another electrical load.

---

# One‑Sentence Summary

**LiftGen is a distributed elevator energy harvesting and storage platform that converts lift motion into usable electricity while providing telemetry, backup power, and building energy optimization.**
