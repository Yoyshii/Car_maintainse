const canvas = document.getElementById('carCanvas');
const ctx = canvas.getContext('2d');

const zones = [
    { id: 'engine', name: 'Engine Bay', x: 90, y: 85, w: 110, h: 65, color: '#3b82f6',
      services: ['Oil Change (5W-30)', 'Air Filter Replacement', 'Spark Plugs Check'],
      status: 'warning', lastService: '2024-01-15', nextService: '2024-06-15', cost: 350 },
    { id: 'roof', name: 'Roof', x: 240, y: 55, w: 120, h: 35, color: '#8b5cf6',
      services: ['Sunroof Cleaning', 'Roof Seal Check'], status: 'good', lastService: '2024-01-05', nextService: '2024-12-05', cost: 50 },
    { id: 'trunk', name: 'Trunk', x: 440, y: 100, w: 80, h: 55, color: '#ec489a',
      services: ['Lock Adjustment', 'Hydraulic Struts'], status: 'good', lastService: '2024-01-10', nextService: '2024-06-10', cost: 60 },
    { id: 'wheel_fl', name: 'Front Left Wheel', x: 100, y: 230, w: 55, h: 50, color: '#10b981',
      services: ['Tire Pressure', 'Wheel Balancing'], status: 'good', lastService: '2024-02-01', nextService: '2024-05-01', cost: 120 },
    { id: 'wheel_fr', name: 'Front Right Wheel', x: 380, y: 230, w: 55, h: 50, color: '#10b981',
      services: ['Tire Pressure', 'Wheel Balancing'], status: 'good', lastService: '2024-02-01', nextService: '2024-05-01', cost: 120 },
    { id: 'wheel_rl', name: 'Rear Left Wheel', x: 470, y: 235, w: 50, h: 45, color: '#10b981',
      services: ['Tire Pressure', 'Wheel Balancing'], status: 'good', lastService: '2024-02-01', nextService: '2024-05-01', cost: 120 },
    { id: 'door_fl', name: 'Front Left Door', x: 190, y: 110, w: 55, h: 95, color: '#f59e0b',
      services: ['Hinge Lubrication', 'Door Seal Check'], status: 'good', lastService: '2024-01-20', nextService: '2024-07-20', cost: 80 },
    { id: 'door_fr', name: 'Front Right Door', x: 300, y: 110, w: 55, h: 95, color: '#f59e0b',
      services: ['Hinge Lubrication', 'Door Seal Check'], status: 'good', lastService: '2024-01-20', nextService: '2024-07-20', cost: 80 },
    { id: 'headlight_l', name: 'Left Headlight', x: 65, y: 95, w: 35, h: 25, color: '#fbbf24',
      services: ['Bulb Replacement', 'Beam Alignment'], status: 'warning', lastService: '2024-02-10', nextService: '2024-08-10', cost: 40 },
    { id: 'headlight_r', name: 'Right Headlight', x: 540, y: 95, w: 35, h: 25, color: '#fbbf24',
      services: ['Bulb Replacement', 'Beam Alignment'], status: 'good', lastService: '2024-02-10', nextService: '2024-08-10', cost: 40 },
    { id: 'exhaust', name: 'Exhaust', x: 530, y: 235, w: 40, h: 30, color: '#ef4444',
      services: ['Exhaust Check', 'Muffler Inspection'], status: 'good', lastService: '2024-01-25', nextService: '2024-07-25', cost: 150 }
];

function drawCar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(320, 360, 250, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    const grad = ctx.createLinearGradient(100, 150, 500, 200);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(80, 150);
    ctx.lineTo(160, 80);
    ctx.lineTo(400, 80);
    ctx.lineTo(580, 150);
    ctx.lineTo(550, 230);
    ctx.lineTo(450, 260);
    ctx.lineTo(120, 260);
    ctx.fill();
    
    // Lower body
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(90, 250, 480, 20);
    
    // Roof
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(180, 80);
    ctx.lineTo(380, 80);
    ctx.lineTo(400, 120);
    ctx.lineTo(160, 120);
    ctx.fill();
    
    // Windows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(190, 90, 70, 35);
    ctx.fillRect(290, 90, 70, 35);
    ctx.fillRect(380, 90, 50, 35);
    
    // Wheels
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(130, 270, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(400, 270, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(495, 270, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(130, 270, 25, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(400, 270, 25, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(495, 270, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Lights
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(65, 130, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(570, 130, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(565, 160, 15, 25);
    ctx.fillRect(565, 195, 15, 20);
    
    // Exhaust
    ctx.fillStyle = '#64748b';
    ctx.fillRect(555, 260, 25, 10);
    
    // Door handles
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(215, 180, 25, 4);
    ctx.fillRect(335, 180, 25, 4);
    
    // Body lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(90, 210);
    ctx.lineTo(550, 210);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(90, 230);
    ctx.lineTo(550, 230);
    ctx.stroke();
    
    // Mirrors
    ctx.fillStyle = '#475569';
    ctx.fillRect(170, 115, 18, 18);
    ctx.fillRect(440, 115, 18, 18);
}

function highlightZone(zone) {
    drawCar();
    ctx.fillStyle = zone.color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x - 2, zone.y - 2, zone.w + 4, zone.h + 4);
}

function showPartInfo(zone) {
    const panel = document.getElementById('infoPanel');
    const statusClass = zone.status === 'warning' ? 'status-warning' : 'status-good';
    const statusText = zone.status === 'warning' ? '⚠️ SERVICE DUE SOON' : '✅ ALL GOOD';
    
    panel.innerHTML = `
        <div class="panel-header"><div class="led"></div><span>COMPONENT DETAILS</span></div>
        <div class="part-card">
            <div class="part-name" style="color: ${zone.color}">${zone.name}</div>
            <div class="${statusClass}" style="display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 16px;">
                <span>●</span> <span>${statusText}</span>
            </div>
            <div class="info-row"><span>LAST SERVICE</span><span>${zone.lastService}</span></div>
            <div class="info-row"><span>NEXT SERVICE</span><span>${zone.nextService}</span></div>
            <div class="info-row"><span>EST. COST</span><span>$${zone.cost}</span></div>
        </div>
        <div style="margin-top: 16px;">
            <div style="color: #fbbf24; margin-bottom: 12px;">RECOMMENDED SERVICES</div>
            ${zone.services.map(s => `<div class="service-item" onclick="alert('✅ Service added: ${s}')"><span>🔧 ${s}</span><span>→</span></div>`).join('')}
        </div>
        <button onclick="resetPanel()" style="background: transparent; border: 1px solid #3b82f6; color: #60a5fa;">← BACK</button>
        <input type="number" id="mileageInput2" placeholder="Update mileage (km)">
        <button id="updateMileageBtn2">UPDATE MILEAGE</button>
    `;
    
    document.getElementById('updateMileageBtn2').addEventListener('click', () => {
        const input = document.getElementById('mileageInput2');
        if (input && input.value) {
            alert(`✅ Mileage updated to ${parseInt(input.value).toLocaleString()} km`);
            input.value = '';
        }
    });
}

function resetPanel() {
    const panel = document.getElementById('infoPanel');
    panel.innerHTML = `
        <div class="panel-header"><div class="led"></div><span>INSPECTION SYSTEM</span></div>
        <div class="placeholder">
            <div>🚗</div>
            <div>SELECT A COMPONENT</div>
            <div>Click on any part of the vehicle</div>
        </div>
        <input type="number" id="mileageInput" placeholder="Update mileage (km)">
        <button id="updateMileageBtn">UPDATE MILEAGE</button>
    `;
    document.getElementById('updateMileageBtn').addEventListener('click', () => {
        const input = document.getElementById('mileageInput');
        if (input && input.value) {
            alert(`✅ Mileage updated to ${parseInt(input.value).toLocaleString()} km`);
            input.value = '';
        }
    });
}

// Events
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    for (const zone of zones) {
        if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
            highlightZone(zone);
            showPartInfo(zone);
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    let hovered = false;
    for (const zone of zones) {
        if (x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h) {
            canvas.style.cursor = 'pointer';
            highlightZone(zone);
            hovered = true;
            break;
        }
    }
    if (!hovered) {
        canvas.style.cursor = 'default';
        drawCar();
    }
});

// Initialize
drawCar();
resetPanel();