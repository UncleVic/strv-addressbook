import { log, LoggerState } from 'mongodb';
import mongoose from 'mongoose';
import { getLog } from './getLog';
import { Env } from './env';

export { ConnectionOptions as mongoOptions } from 'mongoose';

type TMongoFamily = 4 | 6 | null | undefined;

const glog = getLog();

const logger: log = (message?: string | undefined, state?: LoggerState | undefined): void => {
  if (state && state.type === 'error') {
    glog.error(`--- MongoDB: ${message} ---`, { error: new Error(message), state });
  } else {
    glog.info(`--- MongoDB: ${message} ---`, { state });
  }
};

const uri = Env.getStr('MONGODB_URI');
const options: mongoose.ConnectionOptions = {
  dbName: Env.getStr('MONGODB_DB_NAME'),
  appname: Env.getStr('MONGODB_APP_NAME'),
  loggerLevel: Env.getStr('MONGODB_LOGGER_LEVEL'),
  autoIndex: Env.getBool('MONGODB_AUTO_INDEX'),
  serverSelectionTimeoutMS: Env.getInt('MONGODB_SERVER_SELECTION_TIMEOUT'),
  socketTimeoutMS: Env.getInt('MONGODB_SOCKET_TIMEOUT'),
  family: Env.getInt('MONGODB_FAMILY') as TMongoFamily,
  poolSize: Env.getInt('MONGODB_POOL_SIZE'),
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  logger,
};

const db = mongoose.connection;

export async function getMongoConnection(): Promise<mongoose.Connection> {
  if (db.eventNames().length < 8) {
    db.on('connected', () => glog.info('--- MongoDB: Connected ---'));
    db.on('error', event => glog.error('--- MongoDB: connectionError ---', { event }));
    db.on('disconnecting', event => glog.info('--- MongoDB: disconnecting ---', { event }));
    db.on('disconnected', event => glog.error('--- MongoDB: disconnected ---', { event }));
    db.on('close', event => glog.info('--- MongoDB: close ---', { event }));
    db.on('all', event => glog.info('--- MongoDB: connected to All ---', { event }));
    db.on('fullsetup', event => glog.info('--- MongoDB: fullsetup ---', { event }));
    db.on('reconnectFailed', event => glog.error('--- MongoDB: reconnectFailed ---', { event }));
  }

  await mongoose.connect(uri, options);

  return mongoose.connection;
}

export async function closeMongoConnection(): Promise<void> {
  await db.close(false);
}
