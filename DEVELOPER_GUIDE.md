# LiftGen Developer Guide

Welcome to the LiftGen development environment! This guide provides instructions for setting up your local environment to contribute to the LiftGen energy-harvesting platform.

## Project Structure

*   `/firmware/LiftGen_Node`: ESP32 Arduino source code.
*   `/telemetry-web`: HTML/CSS/JS source for the telemetry dashboard.
*   `/docs`: Architecture, Whitepaper, and Investor Briefs.
*   `/hardware`: (Planned) PCB layouts and mechanical designs.

---

## 1. Firmware Development (ESP32)

LiftGen nodes run on the **ESP32** platform using the Arduino framework.

### Prerequisites
*   [Arduino IDE](https://www.arduino.cc/en/software) or [VS Code with PlatformIO](https://platformio.org/).
*   **ESP32 Board Support**: Add `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json` to your Additional Boards Manager URLs.
*   **Libraries Required**:
    *   `ESPAsyncWebServer`
    *   `AsyncTCP`
    *   `arduinoFFT` (for production vibration analysis)

### Configuration
Edit `firmware/LiftGen_Node/config.h` to configure:
*   WiFi SSID and Password.
*   Hardware Pin Mappings for your specific ESP32 Dev Kit.
*   Sampling frequencies and sensor calibration.

### Flashing
1. Open `firmware/LiftGen_Node/LiftGen_Node.ino`.
2. Select your board (e.g., "ESP32 Dev Module").
3. Connect your hardware and Click **Upload**.

---

## 2. Telemetry Dashboard Development

The dashboard is a static web application using modern CSS and Vanilla JS.

### Local Setup
1. Navigate to the `telemetry-web/` directory.
2. Open `index.html` in any modern browser.
3. For local development with live reloading, you can use the VS Code "Live Server" extension or a simple Python server:
   ```bash
   python3 -m http.server 8000
   ```

### Customization
*   **Styling**: Tokens are defined in `style.css` under `:root`.
*   **Simulation**: `app.js` contains the logic for the telemetry simulation. In production, this will be replaced with a WebSocket client connecting to the ESP32 node.

---

## 3. Documentation

We use Markdown for all technical and business documentation.

*   To update the **Whitepaper**: Edit `docs/whitepaper/technical_whitepaper.md`.
*   To update the **Architecture**: Edit `docs/architecture.md` (supports Mermaid diagrams).

---

## 4. Contribution Guidelines

1. **Safety First**: LiftGen must remain non-operational and isolated from the elevator safety chain. Any proposed changes to the energy routing must be reviewed for EN-81 compliance.
2. **Code Style**:
   - Arduino: Use CamelCase for functions and PascalCase for Classes.
   - Frontend: Use BEM-like naming for CSS and ES6+ standards for JS.
3. **Architecture v2**: All new modules should align with the v2 distributed microgrid philosophy.
