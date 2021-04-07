import { Env } from '../lib/env';

export const PORT: number = Env.getInt('PORT');
export const NODE_ENV: string = Env.getStr('NODE_ENV');
export const signals = Env.getStr('PROCESS_SIGNALS').split(',');
export const sslKey: string = Env.getStr('SSL_KEY');
export const sslCert: string = Env.getStr('SSL_CERT');
export const baseServiceRoute: string = Env.getStr('BASE_SERVICE_ROUTE');
export const authRoute: string = Env.getStr('AUTH_ROUTE');
export const saltRound: number = Env.getInt('PASSWORD_SALT_ROUND');
export const secretOrKey: string = Env.getStr('JWT_SECRET');
export const issuer: string = Env.getStr('JWT_ISSUER');
export const audience: string = Env.getStr('JWT_AUDIENCE');
export const expiresIn: string = Env.getStr('JWT_EXPIRES');
export const firebaseUrl: string = Env.getStr('FIREBASE_URL');
