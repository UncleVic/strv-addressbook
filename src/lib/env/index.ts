import { MissingVariableError } from './MissingVariableError';
import { WrongVariableTypeError } from './WrongVariableTypeError';

const trueValues = ['true', 'y', 'yes', 'on', 'enable', 'enabled', '1'];
const falseValues = ['false', 'n', 'no', 'off', 'disable', 'disabled', '0'];

export class Env {
  public static getStr(varName: string): string | never {
    const value = process.env[varName];
    if (typeof value === 'undefined') {
      throw new MissingVariableError(varName);
    }

    return value;
  }

  public static getInt(varName: string): number | never {
    const stringValue = Env.getStr(varName);
    const value = parseInt(stringValue, 10);
    if (isNaN(value)) {
      throw new WrongVariableTypeError(varName, 'number', value);
    }

    return value;
  }

  public static getBool(varName: string): boolean | never {
    const value = Env.getStr(varName).toLowerCase();

    if (trueValues.includes(value)) {
      return true;
    }
    if (falseValues.includes(value)) {
      return false;
    }

    throw new WrongVariableTypeError(varName, 'boolean', value);
  }
}
