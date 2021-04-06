import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { IUser } from './user.types';
const ajv = new Ajv();
addFormats(ajv);

const schema: JSONSchemaType<IUser, true> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
};

export const validateUser = ajv.compile(schema);
