const { createProxyMiddleware } = require('http-proxy-middleware');

const backendHost = process.env.BACKEND_HOST;
if (!backendHost) {
  console.error('Backend host not defined, exiting');
  throw new Error('Backend host not defined')
}

// duplicated from frontend-server, because importing it is too annoying
module.exports = (app) => {
  app.use(
    [
      '/api/',
      '/backend/',
    ],
    createProxyMiddleware({
      target: `http://${backendHost}/`,
      pathRewrite: {
        '^/api/': '/backend/api/',
      },
      logLevel: 'debug',
    })
  );
}