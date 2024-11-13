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
function fetchCoinChart(coinId, chartId) {
    const chartApiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`;

    // Show spinner initially
    const spinner = document.getElementById('loading-spinner');
    const canvas = document.getElementById(chartId);

    // Fetch historical data for the selected coin's price chart
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
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#e0e0e0' // Light color for x-axis ticks
                            },
                            grid: {
                                color: '#444' // Dark grid lines, you can adjust this color
                            }
                        },
                        y: {
                            ticks: {
                                color: '#e0e0e0' // Light color for y-axis ticks
                            },
                            grid: {
                                color: '#444' // Dark grid lines, you can adjust this color
                            }
                        }
                    }
                }
            });

        })
        .catch(error => {
            console.error(`Error fetching chart data for ${coinId}:`, error);
            spinner.innerText = 'Failed to load data.';
        });
}

// Call the functions to fetch data
fetchCoinPrices();  // Fetch prices for all coins at once
fetchCoinChart('bitcoin', 'bitcoin-chart');  // Fetch Bitcoin chart data (you can add more charts as needed)
