import type { Express } from 'express';

type Options = {
  backendHost: string,
  createProxyMiddleware: typeof import('http-proxy-middleware').createProxyMiddleware,
}

export const proxyToBackend = (app: Express, { backendHost, createProxyMiddleware }: Options) =>
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
