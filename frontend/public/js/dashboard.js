document.addEventListener('DOMContentLoaded', async () => {
    if (!window.auth.isAuthenticated()) return;
    
    // Заглушка с данными
    document.getElementById('carsCount').innerText = '1';
    document.getElementById('totalMileage').innerText = '15,247';
    document.getElementById('totalCost').innerText = '₽6,200';
    document.getElementById('upcomingServices').innerText = '3';
    
    const recent = document.getElementById('recentList');
    if (recent) {
        recent.innerHTML = `
            <div class="service-row"><span>2024-01-15</span><span>Замена масла</span><span>₽3,500</span></div>
            <div class="service-row"><span>2024-02-01</span><span>Балансировка колес</span><span>₽1,200</span></div>
            <div class="service-row"><span>2024-02-10</span><span>Регулировка фар</span><span>₽800</span></div>
        `;
    }
});