import express from 'express';
import { v4 as uuid } from 'uuid';
import { baseServiceRoute, authRoute } from '../config';
import { asyncLocalStorage, ILocalStorage } from '../lib/asyncStorage';
import { Env } from '../lib/env';
import { getLog } from '../lib/getLog';
import { AuthRouter } from './auth';
import passport from '../auth/config';
import { AddrBookRouter } from './addrBook';
import { TResponseError } from '../typings/json-api';

export class Router {
  constructor(private readonly app: express.Application) {}

  public addRoutes(): void {
    this.preRouterConfig();
    this.app.use(authRoute, AuthRouter.getRoutes());
    this.app.use(baseServiceRoute, passport.authenticate('jwt', { session: false }), AddrBookRouter.getRoutes());
    this.afterRouterConfig();
  }

  private preRouterConfig(): void {
    this.app.set('env', Env.getStr('NODE_ENV'));
    this.app.disable('x-powered-by');
    this.app.disable('strict routing');
    this.app.enable('trust proxy');
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(passport.initialize());
    this.app.use(this.setTraceId.bind(this));
    this.app.use(this.setLocalStorage.bind(this));
    this.app.use(this.logIncommingRequest.bind(this));
  }

  private afterRouterConfig(): void {
    // Handler 404
    this.app.use((req: express.Request, res: express.Response) => {
      const log = getLog(req.headers['x-request-id'] as string);
      const message = `---- 404 Not found url ----`;
      log.info(message, { status: 404 });

      res.status(404).send(message);
    });

    // Handler 500
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      const log = getLog(req.headers['x-request-id'] as string);

      const responseError: TResponseError = {
        status: 500,
        detail: error.message,
      };
      if (error.name === 'SyntaxError' && error.status === 400 && 'body' in error) {
        responseError.status = 415;
        responseError.detail = 'Unsupported Media Type';
      }

      log.error(responseError);
      res.status(500).json({ errors: [responseError] });
      next(error);
    });
  }

  private setTraceId(req: express.Request, res: express.Response, next: express.NextFunction): void {
    let traceId = req.headers['x-request-id'] as string;
    if (!traceId) {
      const queryParam = Array.isArray(req.query.traceId) ? req.query.traceId[0] : req.query.traceId;
      traceId = (queryParam as string) || uuid();
      req.headers['x-request-id'] = traceId;
    }
    res.setHeader('x-request-id', traceId);
    next();
  }

  private setLocalStorage(req: express.Request, _res: express.Response, next: express.NextFunction): void {
    const store: ILocalStorage = {
      logger: getLog(req.headers['x-request-id'] as string),
      traceId: req.headers['x-request-id'] as string,
    };

    asyncLocalStorage.run(store, () => {
      next();
    });
  }

  private formatRequestObject(req: express.Request, res: express.Response) {
    return {
      headers: req.headers,
      clientIPs: req.ips,
      remoteIP: this.getRemoteIP(req),
      httpMethod: req.method,
      protocol: this.getProtocol(req),
      originalUrl: req.originalUrl,
      baseUrl: req.baseUrl,
      route: req.route,
      params: req.params,
      query: req.query,
      body: req.body,
      responseHeaders: res.getHeaders(),
    };
  }

  private getRemoteIP(req: express.Request): string | string[] | undefined {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  }

  private getProtocol(req: express.Request): string | string[] {
    return req.headers['x-forwarded-proto'] || req.headers['x-original-client-proto'] || req.protocol;
  }

  private logIncommingRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
    const log = getLog();
    log.info('----- Incoming request -----', { incommingRequest: this.formatRequestObject(req, res) });
    next();
  }
}
