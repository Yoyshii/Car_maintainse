document.addEventListener('DOMContentLoaded', async () => {
    if (!window.auth.isAuthenticated()) return;
    
    // Mock data - replace with API call
    document.getElementById('statCars').innerText = '1';
    document.getElementById('totalMileage').innerText = '15,247';
    document.getElementById('totalCost').innerText = '$6,200';
    document.getElementById('upcomingServices').innerText = '3';
    
    const recent = document.getElementById('recentList');
    if (recent) {
        recent.innerHTML = `
            <div class="service-row"><span>2024-01-15</span><span>Oil Change</span><span>$350</span></div>
            <div class="service-row"><span>2024-02-01</span><span>Tire Rotation</span><span>$120</span></div>
            <div class="service-row"><span>2024-02-10</span><span>Headlight Alignment</span><span>$80</span></div>
        `;
    }
});