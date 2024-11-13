// Global variable to hold the current chart instance
let currentChart = null;

// Cache for storing fetched coin chart data
let coinChartCache = {};

// Fetch prices for multiple coins in one request
function fetchCoinPrices() {
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,litecoin,ripple&vs_currencies=usd';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Update the UI with the fetched prices
            document.getElementById('bitcoin-price').innerText = `$${data.bitcoin.usd}`;
            document.getElementById('ethereum-price').innerText = `$${data.ethereum.usd}`;
            document.getElementById('dogecoin-price').innerText = `$${data.dogecoin.usd}`;
            document.getElementById('litecoin-price').innerText = `$${data.litecoin.usd}`;
            document.getElementById('ripple-price').innerText = `$${data.ripple.usd}`;
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fetch historical chart data for a coin
function fetchCoinChart(coinId) {
    // Check if the data for the coin is already in cache
    if (coinChartCache[coinId]) {
        renderChart(coinId, coinChartCache[coinId]);
        return;
    }

    const chartApiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`;

    // Show spinner initially
    const spinner = document.getElementById('loading-spinner');
    const canvas = document.getElementById('coin-chart');

    // Hide the canvas and show the spinner
    spinner.style.display = 'block';
    canvas.style.display = 'none';

    // If there's an existing chart, destroy it before creating a new one
    if (currentChart) {
        currentChart.destroy();
    }

    // Fetch historical data for the selected coin's price chart
    fetch(chartApiUrl)
        .then(response => response.json())
        .then(data => {
            // Cache the data for future use
            coinChartCache[coinId] = data;

            // Render the chart with the fetched data
            renderChart(coinId, data);

            // Hide spinner and show canvas
            spinner.style.display = 'none';
            canvas.style.display = 'block';
        })
        .catch(error => {
            console.error(`Error fetching chart data for ${coinId}:`, error);
            spinner.innerText = 'Failed to load data.';
        });
}

// Function to render the chart using Chart.js
function renderChart(coinId, data) {
    const prices = data.prices.map(item => item[1]);
    const labels = data.prices.map(item => new Date(item[0]).toLocaleDateString());

    const canvas = document.getElementById('coin-chart');
    const ctx = canvas.getContext('2d');

    // Destroy the chart if it already exists
    if (currentChart) {
        currentChart.destroy();
    }

    // Create a new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price (USD)`,
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

// Listen for changes in the dropdown menu
document.getElementById('coin-selector').addEventListener('change', function() {
    const selectedCoin = this.value;
    fetchCoinChart(selectedCoin); // Fetch new chart data based on selected coin
});

// Initial chart load for Bitcoin
fetchCoinChart('bitcoin');
fetchCoinPrices();
