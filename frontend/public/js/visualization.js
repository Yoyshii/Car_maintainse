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

// ========== ОСНОВНЫЕ ФУНКЦИИ ==========

async function loadCars() {
    console.log('🔄 Загрузка автомобилей...');
    
    const token = localStorage.getItem('car_token');
    console.log('Токен:', token ? 'есть' : 'нет');
    
    if (!token) {
        console.log('Нет токена, пропускаем загрузку');
        drawEmptyCar();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/cars`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            cars = await response.json();
            console.log('✅ Загружено автомобилей:', cars.length);
            
            const carSelect = document.getElementById('carSelect');
            if (!carSelect) return;
            
            if (cars.length === 0) {
                carSelect.innerHTML = '<option value="">Нет автомобилей</option>';
                drawEmptyCar();
                return;
            }
            
            carSelect.innerHTML = cars.map(car => 
                `<option value="${car.id}" ${currentCarId === car.id ? 'selected' : ''}>${car.brand} ${car.model} (${car.year}) - ${car.mileage.toLocaleString()} км</option>`
            ).join('');
            
            if (!currentCarId && cars.length > 0) {
                currentCarId = cars[0].id;
                carSelect.value = currentCarId;
            }
            
            drawCar();
        } else {
            console.error('Ошибка загрузки:', response.status);
            drawEmptyCar();
        }
    } catch (error) {
        console.error('Ошибка:', error);
        drawEmptyCar();
    }
}

function drawEmptyCar() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.fillText('Нет добавленных автомобилей', canvas.width/2, canvas.height/2);
    ctx.font = '14px "Segoe UI"';
    ctx.fillText('Нажмите "+" чтобы добавить', canvas.width/2, canvas.height/2 + 40);
}

function drawCar() {
    if (!ctx) return;
    const currentCar = cars.find(c => c.id === currentCarId);
    if (!currentCar) {
        drawEmptyCar();
        return;
    }
    
    const bodyColor = currentCar.color || '#dc2626';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Дорога
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 340, canvas.width, 110);
    
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
    
    // Крыша
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(185, 105);
    ctx.lineTo(385, 105);
    ctx.lineTo(405, 135);
    ctx.lineTo(165, 135);
    ctx.fill();
    
    // Окна
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(195, 115, 65, 28);
    ctx.fillRect(270, 115, 55, 28);
    ctx.fillRect(335, 115, 55, 28);
    
    // Колеса
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.ellipse(135, 290, 40, 33, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(405, 290, 40, 33, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Фары
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(65, 150, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(595, 150, 14, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Название модели
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 14px "Segoe UI"';
    ctx.fillText(`${currentCar.brand} ${currentCar.model}`, 260, 235);
    ctx.font = '12px "Segoe UI"';
    ctx.fillText(`${currentCar.mileage.toLocaleString()} км`, 260, 255);
}

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
    const currentCar = cars.find(c => c.id === currentCarId);
    
    panel.innerHTML = `
        <div class="panel-header"><div class="led"></div><span>ИНФОРМАЦИЯ О ДЕТАЛИ</span></div>
        <div class="part-card">
            <div class="part-name" style="color: ${zone.color}">${zone.icon} ${zone.name}</div>
            <div class="info-row"><span>🚗 Автомобиль</span><span>${currentCar?.brand} ${currentCar?.model}</span></div>
            <div class="info-row"><span>📅 ПОСЛЕДНЕЕ ТО</span><span>${zone.lastService}</span></div>
            <div class="info-row"><span>📅 СЛЕДУЮЩЕЕ ТО</span><span>${zone.nextService}</span></div>
            <div class="info-row"><span>💰 СТОИМОСТЬ</span><span>${zone.cost} ₽</span></div>
        </div>
        <div style="margin-top: 16px;">
            <div style="color: #fbbf24;">🔧 РЕКОМЕНДУЕМЫЕ РАБОТЫ</div>
            ${zone.services.map(s => `<div class="service-item" onclick="alert('✅ Работа добавлена: ${s}')"><span>${s}</span><span>→</span></div>`).join('')}
        </div>
        <button onclick="resetPanel()" class="btn-outline" style="margin-top: 16px;">← НАЗАД</button>
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
        <button onclick="window.location.href='/add-car.html'" class="btn btn-success" style="margin-top: 12px;">➕ ДОБАВИТЬ НОВЫЙ АВТОМОБИЛЬ</button>
    `;
    
    const updateBtn = document.getElementById('updateMileageBtn');
    if (updateBtn) {
        updateBtn.onclick = async () => {
            const input = document.getElementById('mileageInput');
            if (input && input.value) {
                const token = localStorage.getItem('car_token');
                if (!token || !currentCarId) {
                    alert('Ошибка: не авторизован или не выбран автомобиль');
                    return;
                }
                
                try {
                    const response = await fetch(`${API_URL}/cars/${currentCarId}/mileage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ mileage: parseInt(input.value), date: new Date().toISOString().split('T')[0] })
                    });
                    
                    if (response.ok) {
                        alert('✅ Пробег обновлен!');
                        await loadCars();
                        input.value = '';
                        resetPanel();
                    } else {
                        alert('❌ Ошибка при обновлении пробега');
                    }
                } catch (error) {
                    console.error(error);
                    alert('❌ Ошибка при обновлении пробега');
                }
            }
        };
    }
}

// ========== СОБЫТИЯ ==========

if (canvas) {
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
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM загружен, инициализация...');
    
    // Кнопка добавления автомобиля
    const addBtn = document.getElementById('addCarBtn');
    if (addBtn) {
        addBtn.onclick = () => window.location.href = '/add-car.html';
    }
    
    // Селектор автомобилей
    const carSelect = document.getElementById('carSelect');
    if (carSelect) {
        carSelect.onchange = (e) => {
            currentCarId = parseInt(e.target.value);
            drawCar();
        };
    }
    
    // Загружаем автомобили
    loadCars();
    resetPanel();
});