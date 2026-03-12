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
    savingsUSD: 1450.25,
    avoidedCostKES: 188532,
    healthScore: 98.2,
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
    rideHistory: Array.from({ length: 59 }, () => 20 + Math.random() * 10)
};

const initialLogs = [
    "SCADA Link Established: Shaft-01",
    "Phasor Real-time Alignment: ACTIVE",
    "Financial ROI Engine: SYNCHRONIZED",
    "Predictive Health Module: NOMINAL",
    "Grid Frequency: STABLE at 50.000Hz"
];

function init() {
    initialLogs.forEach(msg => addLog(msg));
    
    // Command Console Listeners
    document.getElementById('btn-brk-1').addEventListener('click', () => toggleBreaker('brk1', 'btn-brk-1', 'brk-1'));
    document.getElementById('btn-brk-2').addEventListener('click', () => toggleBreaker('brk2', 'btn-brk-2', 'brk-2'));

    renderRideHistory();
    startSimulation();
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

function renderRideHistory() {
    const container = document.getElementById('ride-history');
    if (!container) return;
    
    container.innerHTML = '';
    state.rideHistory.forEach(voltage => {
        const bar = document.createElement('div');
        bar.className = 'ride-bar';
        bar.style.height = `${(voltage / 40) * 100}%`; 
        container.appendChild(bar);
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
    document.getElementById('savings-ticker').textContent = `$${state.savingsUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('avoided-cost').textContent = `KES ${state.avoidedCostKES.toLocaleString()}`;

    // Health Score
    document.getElementById('health-score').textContent = `${state.healthScore.toFixed(1)}%`;
    document.getElementById('health-fill').style.width = `${state.healthScore}%`;

    // Phase Distribution
    document.getElementById('p1-fill').style.width = `${state.phases.l1}%`;
    document.getElementById('p2-fill').style.width = `${state.phases.l2}%`;
    document.getElementById('p3-fill').style.width = `${state.phases.l3}%`;

    // Phasor Rotation
    document.getElementById('phasor-l1').style.transform = `rotate(${state.phases.shift1}deg)`;
    document.getElementById('phasor-l2').style.transform = `rotate(${state.phases.shift2}deg)`;
    document.getElementById('phasor-l3').style.transform = `rotate(${state.phases.shift3}deg)`;

    // Grid Frequency
    const freqVal = document.getElementById('freq-val');
    freqVal.textContent = state.frequency.toFixed(3);
    const needleGroup = document.getElementById('freq-needle-group');
    if (needleGroup) {
        const rotation = (state.frequency - 50.000) * 900; 
        needleGroup.style.transform = `rotate(${rotation}deg)`;
    }

    // SLD Flow Animations
    animateSLD();

    // High-Precision Spectral Chart
    updateSpectralChart();

    // System Time
    document.getElementById('system-time').textContent = new Date().toLocaleTimeString();
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
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    entry.textContent = `[${time}] ${msg}`;
    log.prepend(entry);
    if (log.children.length > 25) log.lastChild.remove();
}

function simulateRideEvent() {
    const peakVoltage = 22 + Math.random() * 12;
    state.rideHistory.shift();
    state.rideHistory.push(peakVoltage);
    renderRideHistory();
    addLog(`RIDE EVENT: Harvested Peak Voltage ${peakVoltage.toFixed(2)}V`);
    
    // Impact financials
    state.savingsUSD += peakVoltage * 0.005;
    state.avoidedCostKES += Math.floor(peakVoltage * 0.65);
}

function startSimulation() {
    setInterval(() => {
        state.energyHarvested += Math.random() * 0.05;
        state.co2Offset += 0.0025;
        state.carbonCredits = state.co2Offset * 0.0001;
        
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

        state.busContribution = ((state.breakers.brk1 ? 1 : 0) + (state.breakers.brk2 ? 1 : 0)) * (5 + Math.random() * 2);

        updateDashboard();

        const roll = Math.random();
        if (roll > 0.99) {
            addLog("Predictive Health Check: PASS");
        } else if (roll < 0.005) {
            addLog("PHASOR ALIGNMENT JITTER DETECTED", true);
        }

        if (Math.random() > 0.96) {
            simulateRideEvent();
        }
    }, 2000);
}

document.addEventListener('DOMContentLoaded', init);
