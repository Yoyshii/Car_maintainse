document.addEventListener('DOMContentLoaded', () => {
    // History page
    if (document.getElementById('historyBody')) {
        const body = document.getElementById('historyBody');
        body.innerHTML = `
            <tr><td>2024-01-15</td><td>Oil Change</td><td>Engine</td><td>12,000</td><td>$350</td></tr>
            <tr><td>2024-02-01</td><td>Tire Rotation</td><td>Wheels</td><td>13,500</td><td>$120</td></tr>
            <tr><td>2024-02-10</td><td>Headlight Alignment</td><td>Lights</td><td>14,200</td><td>$80</td></tr>
        `;
    }
    
    // Reports page
    if (document.getElementById('exportBtn')) {
        document.getElementById('exportBtn').addEventListener('click', () => {
            alert('📊 FULL REPORT\n\nTotal Mileage: 15,247 km\nTotal Services: 8\nTotal Cost: $6,200\n\n✅ Report exported');
        });
    }
});