/**
 * LiftGen_Node.ino - Main Entry Point for LiftGen ESP32 Firmware
 * 
 * Target: ESP32 Dev Module
 * Objective: Monitor energy harvesting inputs and stream telemetry via WiFi.
 */

#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "config.h"

// State Definitions
enum NodeState {
  BOOT,
  IDLE,
  HARVESTING,
  ASSISTING,
  FAULT
};

// External analysis functions
extern struct VibrationMetrics analyzeVibration();

// State Variables
NodeState currentState = BOOT;
float harvestedPower = 0.0;
float storageLevelPct = 75.0;
float dcBusAssist = 0.0;

// Web Server
AsyncWebServer server(80);

void setup() {
  Serial.begin(115200);
  
  // Pin Initialization
  pinMode(PIN_ENERGY_HARVEST_SENSE, INPUT);
  pinMode(PIN_STORAGE_VOLTAGE_SENSE, INPUT);
  
  // WiFi Access Point Mode for Local Portal
  WiFi.softAP(WIFI_SSID, WIFI_PASS);
  Serial.println("LiftGen Node AP Started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.softAPIP());

  // Simple telemetry endpoint (as a prototype for WebSocket stream)
  server.on("/telemetry", HTTP_GET, [](AsyncWebServerRequest *request){
    String json = "{";
    json += "\"energy\":" + String(harvestedPower, 2) + ",";
    json += "\"storage\":" + String(storageLevelPct, 1) + ",";
    json += "\"bus_assist\":" + String(dcBusAssist, 1);
    json += "}";
    request->send(200, "application/json", json);
  });

  server.begin();
}

void loop() {
  // 1. Monitor Energy Inputs
  int rawEnergy = analogRead(PIN_ENERGY_HARVEST_SENSE);
  harvestedPower = (rawEnergy / 4095.0) * ADC_REF_VOLTAGE * 10.0;
  
  int rawStorage = analogRead(PIN_STORAGE_VOLTAGE_SENSE);
  float batteryVoltage = (rawStorage / 4095.0) * ADC_REF_VOLTAGE * VOLTAGE_DIVIDER_RATIO;
  storageLevelPct = map(batteryVoltage * 10, 240, 274, 0, 100);

  // 2. State Machine Logic
  if (harvestedPower > 0.5) {
    currentState = HARVESTING;
  } else if (storageLevelPct > 80.0) {
    currentState = ASSISTING;
  } else {
    currentState = IDLE;
  }

  // 3. Perform Vibration Analysis (FFT)
  static unsigned long lastAnalysis = 0;
  if (millis() - lastAnalysis > 5000) {
    VibrationMetrics vData = analyzeVibration();
    Serial.printf("State: %d | Vibe Peak: %.2f Hz\n", currentState, vData.peakFrequency);
    lastAnalysis = millis();
  }

  // 4. Power Management
  if (currentState == IDLE) {
    Serial.println("Entering Low Power Mode...");
    esp_light_sleep_start();
  }

  // 5. Logic: DC Bus Assist Simulation
  if (currentState == ASSISTING) {
    dcBusAssist = (storageLevelPct - 80.0) * 5.0;
  } else {
    dcBusAssist = 0.0;
  }

  delay(TELEMETRY_INTERVAL_MS);
}
