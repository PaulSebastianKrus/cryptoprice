// Fetch real-time prices for Bitcoin and Ethereum
const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        document.getElementById('bitcoin-price').innerText = `$${data.bitcoin.usd}`;
        document.getElementById('ethereum-price').innerText = `$${data.ethereum.usd}`;
    })
    .catch(error => console.error('Error fetching data:', error));

const chartApiUrl = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7';

// Show spinner initially
const spinner = document.getElementById('loading-spinner');
const canvas = document.getElementById('bitcoin-chart');

// Fetch historical data for Bitcoin price chart
fetch(chartApiUrl)
    .then(response => response.json())
    .then(data => {
        // Hide spinner and show canvas
        spinner.style.display = 'none';
        canvas.style.display = 'block';

        const prices = data.prices.map(item => item[1]);
        const labels = data.prices.map(item => new Date(item[0]).toLocaleDateString());

        // Render the chart using Chart.js
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Bitcoin Price (USD)',
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
    })
    .catch(error => {
        console.error('Error fetching chart data:', error);
        spinner.innerText = 'Failed to load data.';
    });
