import { AsyncLocalStorage } from 'async_hooks';
import { Logger } from 'winston';

export interface ILocalStorage {
  logger: Logger;
  traceId: string;
}

export const asyncLocalStorage = new AsyncLocalStorage<ILocalStorage>();
