export default async function handler(req, res) {
    try {
        const targetUrl = `https://api.coingecko.com${req.url.replace('/api', '')}`;
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy server error' });
    }
}
