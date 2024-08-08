// server.js
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const URL = process.env.URL; // e.g., 'cataas.com'
const HTTP = process.env.HTTP || 'https'; // 'http' or 'https'

const proxy = createProxyMiddleware({
    target: `${HTTP}://${URL}`,
    changeOrigin: true,
    pathRewrite: {
        [`^/`]: '/', // Remove the leading slash
    },
    onProxyReq: (proxyReq, req, res) => {
        // Forward headers
        Object.keys(req.headers).forEach((key) => {
            proxyReq.setHeader(key, req.headers[key]);
        });
    },
});

const server = http.createServer((req, res) => {
    proxy(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
