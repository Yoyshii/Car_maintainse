const API_URL = 'http://localhost:5000/api';
let currentCarId = null;
let cars = [];

const canvas = document.getElementById('carCanvas');
const ctx = canvas.getContext('2d');

// Зоны для кликов
const zones = [
    { id: 'hood', name: 'Капот / Двигатель', x: 95, y: 105, w: 120, h: 65, color: '#3b82f6',
      services: ['Замена масла (5W-30) - 3 500 ₽', 'Замена воздушного фильтра - 1 200 ₽', 'Замена свечей зажигания - 2 500 ₽'],
      status: 'warning', lastService: '2024-01-15', nextService: '2024-06-15', cost: 3500,
      icon: '🔧', description: 'Двигатель, фильтры, жидкости' },
    { id: 'roof', name: 'Крыша', x: 250, y: 75, w: 130, h: 35, color: '#8b5cf6',
      services: ['Проверка уплотнителей - 500 ₽'], status: 'good', lastService: '2024-01-05', nextService: '2024-12-05', cost: 500,
      icon: '🏠', description: 'Крыша, обтекаемость' },
    { id: 'trunk', name: 'Багажник', x: 470, y: 115, w: 85, h: 55, color: '#ec489a',
      services: ['Регулировка замка - 1 000 ₽'], status: 'good', lastService: '2024-01-10', nextService: '2024-06-10', cost: 1000,
      icon: '📦', description: 'Замок, гидравлика' },
    { id: 'wheel_fl', name: 'Переднее левое колесо', x: 110, y: 250, w: 50, h: 48, color: '#10b981',
      services: ['Проверка давления - 200 ₽', 'Балансировка - 1 200 ₽'], status: 'good', lastService: '2024-02-01', nextService: '2024-05-01', cost: 1200,
      icon: '🛞', description: 'Шина, диск, балансировка' },
    { id: 'wheel_fr', name: 'Переднее правое колесо', x: 400, y: 250, w: 50, h: 48, color: '#10b981',
      services: ['Проверка давления - 200 ₽', 'Балансировка - 1 200 ₽'], status: 'good', lastService: '2024-02-01', nextService: '2024-05-01', cost: 1200,
      icon: '🛞', description: 'Шина, диск, балансировка' },
    { id: 'wheel_rl', name: 'Заднее левое колесо', x: 490, y: 255, w: 48, h: 45, color: '#10b981',
      services: ['Проверка давления - 200 ₽', 'Балансировка - 1 200 ₽'], status: 'good', lastService: '2024-02-01', nextService: '2024-05-01', cost: 1200,
      icon: '🛞', description: 'Шина, диск, балансировка' },
    { id: 'door_fl', name: 'Передняя левая дверь', x: 200, y: 135, w: 50, h: 95, color: '#f59e0b',
      services: ['Смазка петель - 500 ₽'], status: 'good', lastService: '2024-01-20', nextService: '2024-07-20', cost: 500,
      icon: '🚪', description: 'Петли, замки' },
    { id: 'door_fr', name: 'Передняя правая дверь', x: 310, y: 135, w: 50, h: 95, color: '#f59e0b',
      services: ['Смазка петель - 500 ₽'], status: 'good', lastService: '2024-01-20', nextService: '2024-07-20', cost: 500,
      icon: '🚪', description: 'Петли, замки' },
    { id: 'headlight_l', name: 'Левая фара', x: 75, y: 115, w: 35, h: 25, color: '#fbbf24',
      services: ['Замена лампы - 800 ₽'], status: 'warning', lastService: '2024-02-10', nextService: '2024-08-10', cost: 800,
      icon: '💡', description: 'Лампы, регулировка' },
    { id: 'headlight_r', name: 'Правая фара', x: 550, y: 115, w: 35, h: 25, color: '#fbbf24',
      services: ['Замена лампы - 800 ₽'], status: 'good', lastService: '2024-02-10', nextService: '2024-08-10', cost: 800,
      icon: '💡', description: 'Лампы, регулировка' }
];

// Загрузка автомобилей пользователя
async function loadUserCars() {
    const token = window.auth.getToken();
    if (!token) return [];
    
    try {
        const response = await fetch(`${API_URL}/cars`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            cars = await response.json();
            return cars;
        }
    } catch (error) {
        console.error('Ошибка загрузки автомобилей:', error);
    }
    return [];
}

// Обновление селектора автомобилей
async function updateCarSelect() {
    const carSelect = document.getElementById('carSelect');
    if (!carSelect) return;
    
    const userCars = await loadUserCars();
    
    if (userCars.length === 0) {
        carSelect.innerHTML = '<option value="">Нет автомобилей</option>';
        // Показываем сообщение и кнопку добавления
        const addCarBtn = document.getElementById('addCarBtn');
        if (addCarBtn) addCarBtn.style.display = 'block';
        return;
    }
    
    carSelect.innerHTML = userCars.map(car => 
        `<option value="${car.id}" data-color="${car.color}">${car.brand} ${car.model} (${car.year}) - ${car.mileage.toLocaleString()} км</option>`
    ).join('');
    
    // Выбираем первый автомобиль, если ещё не выбран
    if (!currentCarId || !userCars.find(c => c.id === currentCarId)) {
        currentCarId = userCars[0].id;
        carSelect.value = currentCarId;
    }
    
    drawCar();
}

// Получить текущий автомобиль
function getCurrentCar() {
    return cars.find(c => c.id === currentCarId);
}

// Отрисовка автомобиля
function drawCar() {
    const currentCar = getCurrentCar();
    if (!currentCar) {
        // Если нет автомобиля, рисуем пустой холст с сообщением
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '18px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText('Нет добавленных автомобилей', canvas.width/2, canvas.height/2);
        ctx.font = '14px "Segoe UI"';
        ctx.fillText('Нажмите "+" чтобы добавить', canvas.width/2, canvas.height/2 + 40);
        return;
    }
    
    const bodyColor = currentCar.color || '#dc2626';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Дорожное покрытие
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 340, canvas.width, 110);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 30]);
    ctx.beginPath();
    ctx.moveTo(0, 390);
    ctx.lineTo(canvas.width, 390);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(330, 350, 220, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Кузов
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(85, 170);
    ctx.lineTo(150, 105);
    ctx.lineTo(420, 105);
    ctx.lineTo(575, 170);
    ctx.lineTo(555, 250);
    ctx.lineTo(515, 275);
    ctx.lineTo(440, 285);
    ctx.lineTo(125, 285);
    ctx.lineTo(105, 265);
    ctx.lineTo(70, 240);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(85, 200, 490, 15);
    
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(185, 105);
    ctx.lineTo(385, 105);
    ctx.lineTo(405, 135);
    ctx.lineTo(165, 135);
    ctx.fill();
    
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(85, 170);
    ctx.lineTo(150, 105);
    ctx.lineTo(185, 105);
    ctx.lineTo(115, 170);
    ctx.fill();
    
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(420, 105);
    ctx.lineTo(575, 170);
    ctx.lineTo(555, 195);
    ctx.lineTo(420, 140);
    ctx.fill();
    
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(195, 115, 65, 28);
    ctx.fillRect(270, 115, 55, 28);
    ctx.fillRect(335, 115, 55, 28);
    ctx.fillRect(400, 125, 35, 22);
    
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(200, 120, 55, 5);
    ctx.fillRect(275, 120, 45, 5);
    ctx.fillRect(340, 120, 45, 5);
    
    // Колеса
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(135, 290, 40, 33, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(135, 290, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(405, 290, 40, 33, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(405, 290, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(505, 295, 36, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(505, 295, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Фары
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(65, 150, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(595, 150, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(60, 170, 22, 5);
    ctx.fillRect(578, 170, 22, 5);
    
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(580, 180, 15, 25);
    ctx.fillRect(580, 215, 15, 20);
    
    ctx.fillStyle = '#64748b';
    ctx.fillRect(570, 270, 28, 10);
    
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(225, 195, 22, 4);
    ctx.fillRect(330, 195, 22, 4);
    
    ctx.fillStyle = '#475569';
    ctx.fillRect(175, 135, 18, 16);
    ctx.fillRect(455, 135, 18, 16);
    
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = 'bold 14px "Segoe UI"';
    ctx.fillText(`${currentCar.brand} ${currentCar.model}`, 260, 235);
}

// Переключение автомобиля
async function switchCar(carId) {
    currentCarId = carId;
    const car = getCurrentCar();
    if (car) {
        drawCar();
        // Обновляем отображение пробега
        const mileageSpan = document.getElementById('currentMileage');
        if (mileageSpan) mileageSpan.textContent = car.mileage.toLocaleString();
    }
}

// Обновление пробега
async function updateMileage(mileage) {
    const token = window.auth.getToken();
    if (!token || !currentCarId) return false;
    
    try {
        const response = await fetch(`${API_URL}/cars/${currentCarId}/mileage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mileage, date: new Date().toISOString().split('T')[0] })
        });
        
        if (response.ok) {
            const updatedCar = await response.json();
            const carIndex = cars.findIndex(c => c.id === currentCarId);
            if (carIndex !== -1) cars[carIndex] = updatedCar;
            await updateCarSelect();
            drawCar();
            return true;
        }
    } catch (error) {
        console.error(error);
    }
    return false;
}

// Функции для UI
function highlightZone(zone) {
    drawCar();
    ctx.fillStyle = zone.color;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = zone.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(zone.x - 2, zone.y - 2, zone.w + 4, zone.h + 4);
}

function showPartInfo(zone) {
    const panel = document.getElementById('infoPanel');
    const currentCar = getCurrentCar();
    const statusClass = zone.status === 'warning' ? 'status-warning' : 'status-good';
    const statusText = zone.status === 'warning' ? '⚠️ СКОРО ТРЕБУЕТСЯ' : '✅ В НОРМЕ';
    
    panel.innerHTML = `
        <div class="panel-header"><div class="led"></div><span>ИНФОРМАЦИЯ О ДЕТАЛИ</span></div>
        <div class="part-card">
            <div class="part-name" style="color: ${zone.color}; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 28px;">${zone.icon}</span>
                ${zone.name}
            </div>
            <div class="${statusClass}" style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 500; margin-bottom: 16px;">
                <span>●</span> <span>${statusText}</span>
            </div>
            <div class="info-row"><span>🚗 Автомобиль</span><span>${currentCar?.brand} ${currentCar?.model}</span></div>
            <div class="info-row"><span>📅 ПОСЛЕДНЕЕ ТО</span><span>${zone.lastService}</span></div>
            <div class="info-row"><span>📅 СЛЕДУЮЩЕЕ ТО</span><span>${zone.nextService}</span></div>
            <div class="info-row"><span>💰 СТОИМОСТЬ</span><span>${zone.cost.toLocaleString()} ₽</span></div>
        </div>
        <div style="margin-top: 16px;">
            <div style="color: #fbbf24; margin-bottom: 12px;">🔧 РЕКОМЕНДУЕМЫЕ РАБОТЫ</div>
            ${zone.services.map(s => `<div class="service-item" onclick="alert('✅ Работа добавлена в историю:\\n\\n${s}\\nДата: ${new Date().toISOString().split('T')[0]}')"><span>${s}</span><span style="color: #22c55e;">→</span></div>`).join('')}
        </div>
        <button onclick="resetPanel()" style="background: transparent; border: 1px solid #3b82f6; color: #60a5fa; margin-top: 16px;">← НАЗАД</button>
    `;
}

function resetPanel() {
    const panel = document.getElementById('infoPanel');
    panel.innerHTML = `
        <div class="panel-header"><div class="led"></div><span>СИСТЕМА ДИАГНОСТИКИ</span></div>
        <div class="placeholder">
            <div>🚗</div>
            <div>ВЫБЕРИТЕ ДЕТАЛЬ</div>
            <div>Нажмите на любую цветную область автомобиля</div>
        </div>
        <input type="number" id="mileageInput" placeholder="Обновить пробег (км)">
        <button id="updateMileageBtn">ОБНОВИТЬ ПРОБЕГ</button>
        <button onclick="window.location.href='/add-car.html'" style="margin-top: 12px; background: linear-gradient(135deg, #10b981, #059669);">➕ ДОБАВИТЬ НОВЫЙ АВТОМОБИЛЬ</button>
    `;
    
    document.getElementById('updateMileageBtn').addEventListener('click', async () => {
        const input = document.getElementById('mileageInput');
        if (input && input.value) {
            const success = await updateMileage(parseInt(input.value));
            if (success) {
                alert('✅ Пробег обновлен!');
                input.value = '';
                resetPanel();
            } else {
                alert('❌ Ошибка при обновлении пробега');
            }
        }
    });
}

// События canvas
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

// Инициализация
async function init() {
    await updateCarSelect();
    resetPanel();
    drawCar();
}

init();

window.switchCar = switchCar;
window.updateCarSelect = updateCarSelect;