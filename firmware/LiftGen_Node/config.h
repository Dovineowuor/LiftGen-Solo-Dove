/**
 * config.h - Configuration and Pin Mappings for LiftGen ESP32 Node
 */

#ifndef CONFIG_H
#define CONFIG_H

// WiFi Configuration
const char* WIFI_SSID = "LiftGen_AP";
const char* WIFI_PASS = "elevator_energy_v2";

// Hardware Pin Mappings (ESP32)
// Energy Harvesting Input (Analog)
#define PIN_ENERGY_HARVEST_SENSE  34  // Piezo / Generator rectifed input
#define PIN_STORAGE_VOLTAGE_SENSE 35  // LiFePO4 battery voltage

// Vibration Sensing (Analog or I2C)
// For this v2 implementation, we simulate an analog accelerometer input
#define PIN_VIBRATION_X           32
#define PIN_VIBRATION_Y           33
#define PIN_VIBRATION_Z           39

// Telemetry Logic
#define TELEMETRY_INTERVAL_MS     2000
#define FFT_SAMPLES               128
#define SAMPLING_FREQUENCY        1000  // Hz

// Calibration Constants
const float VOLTAGE_DIVIDER_RATIO = 11.0; // Assuming 10k/1k divider
const float ADC_REF_VOLTAGE       = 3.3;

#endif
