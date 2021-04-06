import admin from 'firebase-admin';
import { IContact } from '../models/contact.type';
import { TResponse } from '../typings/json-api';

export class AddrBookController {
  public async createContact(user: string, contact: IContact): Promise<TResponse> {
    try {
      const db = admin.database();
      const ref = await db.ref(`contacts/${user}`).push({ ...contact });
      const result: TResponse = {
        data: {
          type: 'contact',
          id: ref.key || '',
          links: {
            self: ref.toString(),
          },
        },
      };

      return result;
    } catch (error) {
      return {
        errors: [
          {
            status: 400,
            detail: error.message,
          },
        ],
      };
    }
  }
}
