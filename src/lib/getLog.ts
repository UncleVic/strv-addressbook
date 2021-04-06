import { createLogger, format, transports, Logger } from 'winston';
import { asyncLocalStorage } from './asyncStorage';

const { combine, timestamp, prettyPrint } = format;

export function getLog(traceId?: string): Logger {
  const store = asyncLocalStorage.getStore();
  return (
    store?.logger ||
    createLogger({
      defaultMeta: { traceId },
      format: combine(timestamp(), prettyPrint()),
      transports: [new transports.Console()],
    })
  );
}
