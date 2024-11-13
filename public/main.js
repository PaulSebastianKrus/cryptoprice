// Define the API URLs for each coin, updated to use the proxy
const apiUrls = {
    bitcoin: {
        price: '/api/coins/simple/price?ids=bitcoin&vs_currencies=usd',
        chart: '/api/coins/bitcoin/market_chart?vs_currency=usd&days=7'
    },
    ethereum: {
        price: '/api/coins/simple/price?ids=ethereum&vs_currencies=usd',
        chart: '/api/coins/ethereum/market_chart?vs_currency=usd&days=7'
    },
    dogecoin: {
        price: '/api/coins/simple/price?ids=dogecoin&vs_currencies=usd',
        chart: '/api/coins/dogecoin/market_chart?vs_currency=usd&days=7'
    },
    litecoin: {
        price: '/api/coins/simple/price?ids=litecoin&vs_currencies=usd',
        chart: '/api/coins/litecoin/market_chart?vs_currency=usd&days=7'
    },
    ripple: {
        price: '/api/coins/simple/price?ids=ripple&vs_currencies=usd',
        chart: '/api/coins/ripple/market_chart?vs_currency=usd&days=7'
    }
};



// Cache object to store the coin data
const cache = {
    price: {},
    chart: {}
};

let currentChart = null; // Store the current chart instance

function showCoinSection(coin) {
    // Hide all sections
    document.querySelectorAll('.coin-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected coin section
    const section = document.getElementById(`${coin}-section`);
    section.style.display = 'block';

    // Log visibility to check
    console.log(`${coin}-section visibility:`, section.style.display);

    // Fetch and display the coin data (price and chart)
    fetchCoinData(coin);
}


// Function to fetch price and chart data for the selected coin
function fetchCoinData(coin) {
    const priceElement = document.getElementById(`${coin}-price`);
    const chartCanvas = document.getElementById(`${coin}-chart`);
    const loadingSpinner = document.getElementById(`loading-spinner${coin === 'bitcoin' ? '' : '-' + coin}`);

    // Show loading spinner
    loadingSpinner.style.display = 'block';
    chartCanvas.style.display = 'none';

    // Check if the price data is already cached
    if (cache.price[coin]) {
        // Use cached price data
        priceElement.innerText = `$${cache.price[coin].usd}`;
    } else {
        // Fetch price data from API
        fetch(apiUrls[coin].price)
            .then(response => response.json())
            .then(data => {
                cache.price[coin] = data[coin]; // Cache the price data
                priceElement.innerText = `$${data[coin].usd}`;
            })
            .catch(error => {
                priceElement.innerText = 'Error fetching price';
                console.error(`Error fetching ${coin} price:`, error);
            });
    }

    // Check if the chart data is already cached
    if (cache.chart[coin]) {
        // Use cached chart data
        renderChart(cache.chart[coin], coin);
    } else {
        // Fetch chart data from API
        fetch(apiUrls[coin].chart)
            .then(response => response.json())
            .then(data => {
                cache.chart[coin] = data; // Cache the chart data
                renderChart(data, coin); // Render the chart with fetched data
            })
            .catch(error => {
                loadingSpinner.style.display = 'none';
                console.error(`Error fetching ${coin} chart data:`, error);
            });
    }
}
const charts = {}; // Global object to hold chart instances

function renderChart(data, coin) {
    const chartCanvas = document.getElementById(`${coin}-chart`);
    const ctx = chartCanvas.getContext('2d');

    const prices = data.prices.map(item => item[1]);
    const labels = data.prices.map(item => new Date(item[0] * 1000)); // Convert seconds to Date

    // Destroy the existing chart if it exists
    if (charts[coin]) {
        charts[coin].destroy();
    }

    charts[coin] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${coin.charAt(0).toUpperCase() + coin.slice(1)} Price (USD)`,
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
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}




// Event listeners for sidebar links
document.getElementById('bitcoin-link').addEventListener('click', () => showCoinSection('bitcoin'));
document.getElementById('ethereum-link').addEventListener('click', () => showCoinSection('ethereum'));
document.getElementById('dogecoin-link').addEventListener('click', () => showCoinSection('dogecoin'));
document.getElementById('litecoin-link').addEventListener('click', () => showCoinSection('litecoin'));
document.getElementById('ripple-link').addEventListener('click', () => showCoinSection('ripple'));

// Default display (Bitcoin by default)
showCoinSection('bitcoin');
