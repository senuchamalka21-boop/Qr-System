$(document).ready(function () {
    const API_URL = '/api/vehicles';

    // Fetch data and initialize dashboard
    $.get(API_URL, function (response) {
        const vehicles = response.data;
        updateStatCards(vehicles);
        renderFuelTypeChart(vehicles);
        renderStationChart(vehicles);
        renderTrendChart(vehicles);
    });

    function updateStatCards(data) {
        const total = data.length;
        const petrol = data.filter(v => v.FuelType === 'Petrol').length;
        const diesel = data.filter(v => v.FuelType === 'Diesel').length;
        const stations = [...new Set(data.map(v => v.NearestStation))].length;

        $('#totalVehicles').text(total);
        $('#totalPetrol').text(petrol);
        $('#totalDiesel').text(diesel);
        $('#totalStations').text(stations);
    }

    function renderFuelTypeChart(data) {
        const petrol = data.filter(v => v.FuelType === 'Petrol').length;
        const diesel = data.filter(v => v.FuelType === 'Diesel').length;

        new Chart(document.getElementById('fuelTypeChart'), {
            type: 'doughnut',
            data: {
                labels: ['Petrol', 'Diesel'],
                datasets: [{
                    data: [petrol, diesel],
                    backgroundColor: ['#198754', '#ffc107'],
                    hoverOffset: 10
                }]
            },
            options: {
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    function renderStationChart(data) {
        const stationCounts = {};
        data.forEach(v => {
            stationCounts[v.NearestStation] = (stationCounts[v.NearestStation] || 0) + 1;
        });

        const labels = Object.keys(stationCounts);
        const counts = Object.values(stationCounts);

        new Chart(document.getElementById('stationChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Vehicles',
                    data: counts,
                    backgroundColor: '#4361ee',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    function renderTrendChart(data) {
        // Process data by date (using createdAt from MongoDB)
        const dates = {};
        data.forEach(v => {
            const date = new Date(v.createdAt).toLocaleDateString();
            dates[date] = (dates[date] || 0) + 1;
        });

        const labels = Object.keys(dates).sort();
        const counts = labels.map(label => dates[label]);

        new Chart(document.getElementById('trendChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Registrations',
                    data: counts,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } }
                }
            }
        });
    }
});
