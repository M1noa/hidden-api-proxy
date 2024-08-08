require('dotenv').config();
const http = require('http');
const https = require('https');
const url = require('url');

// Load URL from .env file and construct the full proxy URL
const PROXY_URL = `https://${process.env.URL}`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);

  // Construct the proxied URL
  const targetUrl = PROXY_URL + parsedUrl.path;

  // Make the request to the proxied server
  https.get(targetUrl, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  }).on('error', (e) => {
    res.writeHead(500);
    res.end(`Error: ${e.message}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
