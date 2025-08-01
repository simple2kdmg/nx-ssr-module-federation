import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import * as cors from 'cors';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './bootstrap.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const browserBundles = join(process.cwd(), 'dist/main-app/browser');
  const serverBundles = join(process.cwd(), 'dist/main-app/server');
  const indexHtml = existsSync(join(browserBundles, 'index.original.html'))
    ? join(browserBundles, 'index.original.html')
    : join(browserBundles, 'index.html');

  server.use(cors());

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserBundles);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserBundles, { maxAge: '1y' }));
  // Serve static files from /server
  server.use('/server', express.static(serverBundles, { maxAge: '1y' }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserBundles,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);

    /**
     * DO NOT REMOVE IF USING @nx/angular:module-federation-dev-ssr executor
     * to serve your Host application with this Remote application.
     * This message allows Nx to determine when the Remote is ready to be
     * consumed by the Host.
     */
    process.send && process.send('nx.server.ready');
  });
}

run();

export default bootstrap;
