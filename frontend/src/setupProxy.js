const { proxyToBackend } = require('../../frontend-server/src/proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  proxyToBackend(app, {
    backendHost: 'localhost:8000',
    createProxyMiddleware,
  })
}