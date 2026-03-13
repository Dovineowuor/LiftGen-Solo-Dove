// LiftGen Grid Portal - SCADA Simulation v6 (Industrial Excellence)
const state = {
    energyHarvested: 1450.25,
    storageLevel: 82.4,
    busContribution: 12.5,
    efficiency: 94.2,
    frequency: 50.000, 
    phaseLoad: 24.1,
    co2Offset: 42.50,
    carbonCredits: 0.042500,
    savingsKsh: 188532.50,
    avoidedCostKsh: 188532,
    healthScore: 98.2,
    thd: 0.042,
    breakers: {
        brk1: true,
        brk2: true
    },
    phases: {
        l1: 82,
        l2: 78,
        l3: 80,
        shift1: 0,
        shift2: 120,
        shift3: 240
    },
    rideHistory: Array.from({ length: 150 }, (_, i) => ({
        voltage: 20 + Math.random() * 10,
        timestamp: Date.now() - (150 - i) * 120000 // Fake historical timestamps (every 2mins)
    })),
    rideFilterMode: '50' // '50', 'hour', 'all'
};

const initialLogs = [
    "SCADA Link Established: Shaft-01",
    "Phasor Real-time Alignment: ACTIVE",
    "Financial ROI Engine: SYNCHRONIZED",
    "Predictive Health Module: NOMINAL",
    "Grid Frequency: STABLE at 50.000Hz"
];

const WS_URL = 'ws://localhost:8080/scada-stream'; // Update this to match your actual backend URL
let ws = null;
let simulationInterval = null;
let lastDataReceivedTime = 0;
const FALLBACK_TIMEOUT_MS = 10000; // 10 seconds without data triggers fallback

function init() {
    initialLogs.forEach(msg => addLog(msg));
    
    // Command Console Listeners
    document.getElementById('btn-brk-1').addEventListener('click', () => toggleBreaker('brk1', 'btn-brk-1', 'brk-1'));
    document.getElementById('btn-brk-2').addEventListener('click', () => toggleBreaker('brk2', 'btn-brk-2', 'brk-2'));

    // Ride History Filter Listeners
    document.getElementById('btn-filter-50').addEventListener('click', () => setRideFilter('50'));
    document.getElementById('btn-filter-hour').addEventListener('click', () => setRideFilter('hour'));
    document.getElementById('btn-filter-all').addEventListener('click', () => setRideFilter('all'));

    renderRideHistory();
    updateDashboard();
    updateClock();
    setInterval(updateClock, 1000);
    
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'sim') {
        addLog("Starting in Simulation Mode (Forced)", true);
        startSimulation();
    } else {
        connectWebSocket();
    }
    
    // Check for stale data regularly
    setInterval(checkDataLiveness, 2000);
}

function checkDataLiveness() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'sim') return; // Already forcing simulation

    const now = Date.now();
    // If we haven't received data recently AND we aren't already simulating
    if (now - lastDataReceivedTime > FALLBACK_TIMEOUT_MS && !simulationInterval) {
        addLog("Data Stream Lost: Falling back to Seed Data Simulation", true);
        startSimulation();
    }
}

function connectWebSocket() {
    addLog(`Connecting to SCADA WebSocket at ${WS_URL}...`);
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        addLog("SCADA Link Established: LIVE CONNECTION", false);
        const statusInd = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.system-status span');
        if (statusInd) statusInd.style.background = 'var(--accent)';
        if (statusText) statusText.textContent = 'SCADA System: LIVE (WS)';
    };

    ws.onmessage = (event) => {
        try {
            const payload = JSON.parse(event.data);
            
            lastDataReceivedTime = Date.now();
            
            // If simulation is running, stop it since we have live data
            if (simulationInterval) {
                clearInterval(simulationInterval);
                simulationInterval = null;
                addLog("Live Data Restored: Halting Simulation", false);
            }

            processTelemetryPayload(payload);
        } catch (e) {
            console.error("Failed to parse telemetry payload", e);
        }
    };

    ws.onclose = () => {
        addLog("SCADA Link Lost. Retrying in 5s...", true);
        const statusInd = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.system-status span');
        if (statusInd) statusInd.style.background = 'var(--accent-alert)';
        if (statusText) statusText.textContent = 'SCADA System: DISCONNECTED';
        
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (err) => {
        console.error("WebSocket Error:", err);
    };
}

function processTelemetryPayload(payload) {
    if (payload.total_energy_kwh !== undefined) state.energyHarvested = payload.total_energy_kwh;
    if (payload.battery_soc_percent !== undefined) state.storageLevel = payload.battery_soc_percent;
    if (payload.dc_bus_injection_w !== undefined) state.busContribution = payload.dc_bus_injection_w;
    if (payload.grid_freq_hz !== undefined) state.frequency = payload.grid_freq_hz;
    if (payload.harmonic_distortion !== undefined) state.thd = payload.harmonic_distortion;
    if (payload.health_score !== undefined) state.healthScore = payload.health_score;

    if (payload.phases) {
        state.phases = { ...state.phases, ...payload.phases };
    }
    
    // Automatically derive CO2 based on actual grid injection (example factor)
    if (payload.total_energy_kwh !== undefined) {
        state.co2Offset = state.energyHarvested * 0.029; 
        state.carbonCredits = state.co2Offset / 1000;
    }
    
    if (payload.ride_peak_voltage !== undefined && payload.ride_peak_voltage !== null) {
        simulateRideEventValue(payload.ride_peak_voltage);
    }
    
    updateDashboard();
}

function updateClock() {
    const timeEl = document.getElementById('system-time');
    if (timeEl) {
        timeEl.textContent = new Date().toLocaleTimeString('en-KE', { 
            hour12: false,
            timeZone: 'Africa/Nairobi'
        });
    }
}

function toggleBreaker(id, btnId, svgId) {
    state.breakers[id] = !state.breakers[id];
    const btn = document.getElementById(btnId);
    const svgCircle = document.getElementById(svgId);
    
    if (state.breakers[id]) {
        btn.classList.add('active');
        btn.textContent = `${id.toUpperCase().replace('BRK', 'BRK-0')} ON`;
        svgCircle.style.stroke = 'var(--accent)';
        addLog(`COMMAND: ${id.toUpperCase()} CLOSED (CONNECTED)`);
    } else {
        btn.classList.remove('active');
        btn.textContent = `${id.toUpperCase().replace('BRK', 'BRK-0')} OFF`;
        svgCircle.style.stroke = 'var(--accent-alert)';
        addLog(`COMMAND: ${id.toUpperCase()} OPENED (DISCONNECTED)`, true);
    }
}

function setRideFilter(mode) {
    state.rideFilterMode = mode;
    
    // Update button states
    ['50', 'hour', 'all'].forEach(m => {
        const btn = document.getElementById(`btn-filter-${m}`);
        if(btn) {
            if(m === mode) {
                btn.classList.add('bg-accent', 'text-black');
                btn.classList.remove('bg-transparent', 'text-textDim');
            } else {
                btn.classList.remove('bg-accent', 'text-black');
                btn.classList.add('bg-transparent', 'text-textDim');
            }
        }
    });
    
    renderRideHistory();
}

function getFilteredRides() {
    const now = Date.now();
    let filtered = state.rideHistory;
    
    if (state.rideFilterMode === 'hour') {
        const oneHourAgo = now - (60 * 60 * 1000);
        filtered = state.rideHistory.filter(r => r.timestamp >= oneHourAgo);
    } else if (state.rideFilterMode === '50') {
        filtered = state.rideHistory.slice(-50);
    }
    
    return filtered;
}

function renderRideHistory() {
    const container = document.getElementById('ride-history');
    if (!container) return;
    
    const filteredRides = getFilteredRides();
    container.innerHTML = '';
    
    if(filteredRides.length === 0) {
       container.innerHTML = '<div style="width: 100%; text-align: center; color: #666; font-size: 0.8rem; align-self: center;">No rides found in timeframe</div>';
       document.getElementById('avg-voltage').textContent = `Avg: 0.00V`;
       document.getElementById('ride-count-label').textContent = `0 Rides`;
       return;
    }
    
    let totalVoltage = 0;

    filteredRides.forEach(ride => {
        totalVoltage += ride.voltage;
        const bar = document.createElement('div');
        bar.className = 'ride-bar';
        bar.style.height = `${(ride.voltage / 40) * 100}%`;
        bar.title = `${timeAgo(ride.timestamp)} • ${ride.voltage.toFixed(1)}V (${hourSlotLabel(ride.timestamp)})`;
        container.appendChild(bar);
    });
    
    // Update labels based on filtered data
    const avgVal = totalVoltage / filteredRides.length;
    document.getElementById('avg-voltage').textContent = `Avg: ${avgVal.toFixed(2)}V`;
    document.getElementById('ride-count-label').textContent = `${filteredRides.length} Rides`;

    renderRideTable(filteredRides);
}

function timeAgo(timestamp) {
    const now = Date.now();
    const diffSec = Math.floor((now - timestamp) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr  = Math.floor(diffMin / 60);
    if (diffSec < 10)  return 'just now';
    if (diffSec < 60)  return `${diffSec}s ago`;
    if (diffMin < 60)  return `${diffMin} min ago`;
    if (diffHr  < 24)  return `${diffHr} hr ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
}

function hourSlotLabel(timestamp) {
    const now = new Date();
    const rideDate = new Date(timestamp);
    const hrDiff = now.getHours() - rideDate.getHours() + (now.getDate() - rideDate.getDate()) * 24;
    if (hrDiff === 0) return 'This Hour';
    if (hrDiff === 1) return '1 hr ago';
    if (hrDiff <= 6)  return `${hrDiff} hrs ago`;
    const h = String(rideDate.getHours()).padStart(2, '0');
    return `${h}:00 \u2013 ${h}:59`;
}

function renderRideTable(rides) {
    const tbody = document.getElementById('ride-table-body');
    if (!tbody) return;
    const displayRides = rides.slice(-20).reverse();
    tbody.innerHTML = '';
    displayRides.forEach((ride, i) => {
        const tr = document.createElement('tr');
        const statusClass = ride.voltage >= 28 ? 'text-accentEnergy' : ride.voltage >= 22 ? 'text-accentStorage' : 'text-accentAlert';
        const statusLabel = ride.voltage >= 28 ? 'HIGH' : ride.voltage >= 22 ? 'NOMINAL' : 'LOW';
        tr.className = 'border-b border-glassBorder hover:bg-white/5 transition-colors';
        tr.innerHTML = `
            <td class="py-1.5 px-2 text-textDim font-mono">#${rides.length - i}</td>
            <td class="py-1.5 px-2 font-mono">${new Date(ride.timestamp).toLocaleTimeString('en-KE', { hour12: false, timeZone: 'Africa/Nairobi' })}</td>
            <td class="py-1.5 px-2 font-mono text-accentBus">${hourSlotLabel(ride.timestamp)} &bull; ${timeAgo(ride.timestamp)}</td>
            <td class="py-1.5 px-2 font-mono font-bold text-accent">${ride.voltage.toFixed(2)}V</td>
            <td class="py-1.5 px-2"><span class="${statusClass} font-bold text-[10px] tracking-widest">${statusLabel}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function updateDashboard() {
    // Basic Metrics
    document.getElementById('energy-harvested').textContent = state.energyHarvested.toFixed(3);
    document.getElementById('storage-level').textContent = state.storageLevel.toFixed(1);
    document.getElementById('storage-progress').style.width = `${state.storageLevel}%`;
    document.getElementById('bus-contribution').textContent = state.busContribution.toFixed(2);

    // ESG & Financials
    document.getElementById('co2-offset').textContent = `${state.co2Offset.toFixed(2)} kg`;
    document.getElementById('tree-equiv').textContent = (state.co2Offset / 4.1).toFixed(2);
    document.getElementById('carbon-credits').textContent = state.carbonCredits.toFixed(6);
    document.getElementById('savings-ticker').textContent = `Ksh ${state.savingsKsh.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('avoided-cost').textContent = `Ksh ${state.avoidedCostKsh.toLocaleString()}`;

    // Health Score
    document.getElementById('health-score').textContent = `${state.healthScore.toFixed(1)}%`;
    document.getElementById('health-fill').style.width = `${state.healthScore}%`;

    // Phase Distribution
    document.getElementById('p1-fill').style.width = `${state.phases.l1}%`;
    document.getElementById('p2-fill').style.width = `${state.phases.l2}%`;
    document.getElementById('p3-fill').style.width = `${state.phases.l3}%`;

    // Dynamic Phasor Trigonometry
    // Base radius is 35 (max voltage representation)
    const centerX = 50;
    const centerY = 50;
    
    // Convert percentage magnitude (0-100) to actual SVG length (0-35)
    // Nominal is around 80% = length 28
    const r1 = (state.phases.l1 / 100) * 35; 
    const r2 = (state.phases.l2 / 100) * 35;
    const r3 = (state.phases.l3 / 100) * 35;
    
    // Angles in radians (SVG 0 deg is right/East, but we want 0 deg pointing Up/North)
    // So we subtract 90 degrees (Math.PI / 2) from shift
    const rad1 = (state.phases.shift1 - 90) * (Math.PI / 180);
    const rad2 = (state.phases.shift2 - 90) * (Math.PI / 180);
    const rad3 = (state.phases.shift3 - 90) * (Math.PI / 180);

    // L1 coords
    const x1 = centerX + r1 * Math.cos(rad1);
    const y1 = centerY + r1 * Math.sin(rad1);
    
    // L2 coords
    const x2 = centerX + r2 * Math.cos(rad2);
    const y2 = centerY + r2 * Math.sin(rad2);
    
    // L3 coords
    const x3 = centerX + r3 * Math.cos(rad3);
    const y3 = centerY + r3 * Math.sin(rad3);

    // Apply Line Endpoints
    document.getElementById('line-l1').setAttribute('x2', x1.toFixed(2));
    document.getElementById('line-l1').setAttribute('y2', y1.toFixed(2));
    
    document.getElementById('line-l2').setAttribute('x2', x2.toFixed(2));
    document.getElementById('line-l2').setAttribute('y2', y2.toFixed(2));
    
    document.getElementById('line-l3').setAttribute('x2', x3.toFixed(2));
    document.getElementById('line-l3').setAttribute('y2', y3.toFixed(2));

    // Apply Dot Endpoints
    document.getElementById('dot-l1').setAttribute('cx', x1.toFixed(2));
    document.getElementById('dot-l1').setAttribute('cy', y1.toFixed(2));
    
    document.getElementById('dot-l2').setAttribute('cx', x2.toFixed(2));
    document.getElementById('dot-l2').setAttribute('cy', y2.toFixed(2));
    
    document.getElementById('dot-l3').setAttribute('cx', x3.toFixed(2));
    document.getElementById('dot-l3').setAttribute('cy', y3.toFixed(2));
    
    // Update labels to show actual dynamic shifts (rounded)
    document.getElementById('label-l1').textContent = `L1: ${state.phases.shift1.toFixed(1)}°`;
    document.getElementById('label-l2').textContent = `L2: ${state.phases.shift2.toFixed(1)}°`;
    document.getElementById('label-l3').textContent = `L3: ${state.phases.shift3.toFixed(1)}°`;

    // Grid Frequency
    const freqVal = document.getElementById('freq-val');
    freqVal.textContent = state.frequency.toFixed(3);
    const needleGroup = document.getElementById('freq-needle-group');
    if (needleGroup) {
        // Center is 50.000 Hz = 0deg rotation
        // Let's say +/- 0.050 Hz = +/- 45deg rotation for the gauge span
        let diff = state.frequency - 50.000;
        
        // Clamp the difference so the needle doesn't break out of the gauge graphic visually
        const MAX_DIFF = 0.060; 
        if (diff > MAX_DIFF) diff = MAX_DIFF;
        if (diff < -MAX_DIFF) diff = -MAX_DIFF;

        // Map the diff into degrees: 0.050 Hz diff -> 45 degrees
        const rotationDegrees = (diff / 0.050) * 45;

        needleGroup.style.transform = `rotate(${rotationDegrees}deg)`;
    }

    // SLD Flow Animations
    animateSLD();

    // High-Precision Spectral Chart
    updateSpectralChart();

    // Avg Voltage update handled inside renderRideHistory() now

    // THD update
    document.getElementById('thd-val').textContent = `THD (Total Harmonic Distortion): ${state.thd.toFixed(3)}%`;
}

function updateSpectralChart() {
    const path = document.getElementById('spectral-path');
    if (!path) return;

    let d = "M 0 150";
    for (let x = 0; x <= 400; x += 10) {
        let noise = (Math.random() - 0.5) * 4;
        let y = 140 - 80 * Math.exp(-Math.pow(x - 150, 2) / 800) - 40 * Math.exp(-Math.pow(x - 250, 2) / 600) + noise;
        d += ` L ${x} ${Math.max(10, y)}`;
    }
    path.setAttribute('d', d);
}

function animateSLD() {
    const activeColor = 'var(--accent)';
    const dimColor = '#222';

    document.getElementById('flow-1').style.stroke = state.breakers.brk1 ? activeColor : dimColor;
    document.getElementById('flow-2').style.stroke = state.breakers.brk2 ? activeColor : dimColor;
    
    const combinedPower = (state.breakers.brk1 ? 5 : 0) + (state.breakers.brk2 ? 5 : 0);
    document.getElementById('flow-main').style.stroke = combinedPower > 0 ? activeColor : dimColor;
    document.getElementById('flow-dist').style.stroke = (combinedPower > 0 && state.busContribution > 0) ? 'var(--accent-bus)' : dimColor;
}

function addLog(msg, isAlert = false) {
    const log = document.getElementById('event-log');
    if (!log) return;
    const entry = document.createElement('div');
    entry.className = isAlert ? 'log-entry alert' : 'log-entry';
    const time = new Date().toLocaleTimeString('en-KE', { 
        hour12: false,
        timeZone: 'Africa/Nairobi'
    });
    entry.textContent = `[${time}] ${msg}`;
    log.prepend(entry);
    if (log.children.length > 25) log.lastChild.remove();
}

function simulateRideEventValue(peakVoltage) {
    if (state.rideHistory.length > 1000) {
        state.rideHistory.shift(); // Prevent memory leak, cap at 1000 rides
    }
    state.rideHistory.push({
        voltage: peakVoltage,
        timestamp: Date.now()
    });
    renderRideHistory();
    addLog(`RIDE EVENT: Harvested Peak Voltage ${peakVoltage.toFixed(2)}V`);
    
    // Impact financials
    state.savingsKsh += peakVoltage * 0.005;
    state.avoidedCostKsh += Math.floor(peakVoltage * 0.65);
}

function simulateRandomRideEvent() {
    const peakVoltage = 22 + Math.random() * 12;
    simulateRideEventValue(peakVoltage);
}

function startSimulation() {
    if (simulationInterval) return; // Prevent multiple intervals
    
    simulationInterval = setInterval(() => {
        state.energyHarvested += Math.random() * 0.05;
        state.co2Offset += 0.0025;
        // Verified Carbon Credit Math: 1 Credit = 1000 kg CO2
        state.carbonCredits = state.co2Offset / 1000;
        
        state.storageLevel = Math.min(100, state.storageLevel + (Math.random() - 0.48) * 0.05);
        state.frequency = 50.000 + (Math.random() - 0.5) * 0.012; 
        
        state.phases.l1 = 80 + (Math.random() - 0.5) * 4;
        state.phases.l2 = 80 + (Math.random() - 0.5) * 4;
        state.phases.l3 = 80 + (Math.random() - 0.5) * 4;

        // Simulate slight phase shifts
        state.phases.shift1 = (Math.random() - 0.5) * 2;
        state.phases.shift2 = 120 + (Math.random() - 0.5) * 5;
        state.phases.shift3 = 240 + (Math.random() - 0.5) * 3;

        // Health Score minor fluctuation based on activity
        state.healthScore = Math.max(85, state.healthScore + (Math.random() - 0.52) * 0.1);
        
        // THD minor jitter
        state.thd = 0.042 + (Math.random() - 0.5) * 0.005;

        state.busContribution = ((state.breakers.brk1 ? 1 : 0) + (state.breakers.brk2 ? 1 : 0)) * (5 + Math.random() * 2);

        updateDashboard();

        const roll = Math.random();
        if (roll > 0.99) {
            addLog("Predictive Health Check: PASS");
        } else if (roll < 0.005) {
            addLog("PHASOR ALIGNMENT JITTER DETECTED", true);
        }

        if (Math.random() > 0.96) {
            simulateRandomRideEvent();
        }
    }, 2000);
}

document.addEventListener('DOMContentLoaded', init);
