import express from 'express';
import https from 'https';
import http from 'http';
import fsModule from 'fs';
import { Router } from './routes/router';
import { getLog } from './lib/getLog';
import admin from 'firebase-admin';
import { closeMongoConnection, getMongoConnection } from './lib/db';
import { firebaseUrl, PORT, signals, sslCert, sslKey } from './config';

const HTTP_REFRESH = {
  'Content-Type': 'text/html',
  Refresh: '15',
};

export class App {
  private readonly app: express.Application;
  private server?: https.Server | http.Server;
  private log = getLog();
  private isShuttingDown = false;
  private curentRequests = new Map<express.Response, string>();

  constructor() {
    this.app = express();
    this.processEventsHandler(this.cleanUp.bind(this));
  }

  public async start(): Promise<void> {
    await getMongoConnection();

    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: firebaseUrl,
    });

    const router = new Router(this.app);
    router.addRoutes();

    this.createServer();
  }

  private closeHTTPServer() {
    this.server?.close((err?: Error) => {
      if (err) {
        this.log.error(err);
      } else {
        this.log.info(`Express HTTP server has been stopped`);
      }
    });

    console.log(`Count of active requests = ${this.curentRequests.size}`);

    this.log.info(`Count of active requests = ${this.curentRequests.size}`);
    for (const res of this.curentRequests.keys()) {
      this.curentRequests.delete(res);
      if (!res.writableEnded) {
        res.writeHead(503, HTTP_REFRESH);
        res.end('Service is unavailable');
      }
    }
  }

  private async closeConnections() {
    this.closeHTTPServer();
    await closeMongoConnection();
  }

  private async cleanUp(signal: string) {
    if (!this.isShuttingDown) {
      this.isShuttingDown = true;
      try {
        await this.closeConnections();
        signals.forEach(sig => process.removeListener(sig, this.cleanUp.bind(this)));
        process.kill(process.pid, signal);
        setTimeout(() => {
          const log = getLog();
          log.error('Terminating APP');
          process.exit(1);
        }, 10000);
      } catch (error) {
        this.log.alert('error happened during shutdown', error);
        process.exit(1);
      }
    }
  }

  private createServer(): void {
    if (fsModule.existsSync(sslKey) && fsModule.existsSync(sslCert)) {
      const httpsOptions = {
        key: fsModule.readFileSync(sslKey),
        cert: fsModule.readFileSync(sslCert),
        secureOptions: require('constants').SSL_OP_NO_TLSv1, // eslint-disable-line @typescript-eslint/no-var-requires
      };
      this.server = https.createServer(httpsOptions, this.app).listen(PORT, () => {
        this.log.info(`Express HTTPS server listening on port ${PORT}`);
      });
    } else {
      this.server = http.createServer(this.app).listen(PORT, () => {
        this.log.info(`Express HTTP server listening on port ${PORT}`);
      });
    }

    this.server.on('request', (_req, res: express.Response) => {
      this.curentRequests.set(res, '');
      res.once('close', () => {
        this.curentRequests.delete(res);
      });
    });
  }

  private processEventsHandler(cleanUp: (signal: string) => Promise<void>) {
    const log = getLog();

    process.on('uncaughtException', (error: Error) => {
      log.error('***!!! Uncaught exception emitted !!!***', { error });
      setTimeout(() => {
        log.error('Terminating APP');
        process.exit(1);
      }, 10000);
      log.info('Try Gracefull shutdown...');
      process.kill(process.pid, 'SIGINT');
    });

    process.on('unhandledRejection', (reason, promise) => {
      log.error(`Unhandled Rejection promise`, { error: new Error('Unhandled Rejection promise'), reason, promise });
    });

    // Subscribe process on external signals
    signals.forEach(sig => process.on(sig, async () => cleanUp(sig)));
  }
}
