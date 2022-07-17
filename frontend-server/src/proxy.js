const proxyToBackend = (app, { backendHost, createProxyMiddleware }) =>
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
      logger: console,
      logLevel: 'debug',
    })
  );

  module.exports = { proxyToBackend }