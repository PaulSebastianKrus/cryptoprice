const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Increase max listeners to avoid warnings
require('events').EventEmitter.defaultMaxListeners = 25;

// Initialize express application
const app = express();

// General proxy for CoinGecko simple price endpoint
app.use('/api/coins/simple/price', createProxyMiddleware({
    target: 'https://api.coingecko.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/coins/simple/price': '/api/v3/simple/price',
    },
    logLevel: 'debug',
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy server error');
    }
}));

// General proxy for CoinGecko market chart endpoint
app.use('/api/coins/:coin/market_chart', createProxyMiddleware({
    target: 'https://api.coingecko.com',
    changeOrigin: true,
    pathRewrite: (path) => {
        const match = path.match(/^\/api\/coins\/([^/]+)\/market_chart/);
        if (match) {
            return `/api/v3/coins/${match[1]}/market_chart`;
        }
        return path;
    },
    logLevel: 'debug',
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy server error');
    }
}));

// Static file serving (move below proxy middleware to avoid conflicts)
app.use(express.static('public', {
    setHeaders: (res, path) => {
        console.log('Serving:', path);
    }
}));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
