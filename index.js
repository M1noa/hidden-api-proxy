require('dotenv').config();
const http = require('http');
const https = require('https');
const url = require('url');

// Load URL from .env file and construct the full proxy URL
const PROXY_URL = `https://${process.env.URL}`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const targetUrl = PROXY_URL + parsedUrl.path;

  // Configure options for the proxied request
  const options = {
    method: req.method,
    headers: req.headers,
  };

  // Forward the request to the proxied server
  const proxyReq = https.request(targetUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  // Handle request data (for POST, PUT, etc.)
  req.pipe(proxyReq);

  // Handle errors
  proxyReq.on('error', (e) => {
    res.writeHead(500);
    res.end(`Error: ${e.message}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
