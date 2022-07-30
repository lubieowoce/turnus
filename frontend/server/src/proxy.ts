import type { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

type Options = {
  backendHost: string,
}

export const proxyToBackend = (app: Express, { backendHost }: Options) =>
  app.use(
    [
      '/api/',
      '/backend/',
    ],
    createProxyMiddleware({
      target: `http://${backendHost}`,
      pathRewrite: {
        '^/api/': '/backend/api/',
      },
      logLevel: 'debug',
    })
  );
