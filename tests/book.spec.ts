//
import { getMongoConnection } from '../src/lib/db';
import { IUser } from '../src/models/user.types'
import { Users } from '../src/models/user.model'
import { UserController } from '../src/controllers/user.controller'
import { AddrBookController } from '../src/controllers/addrBook.controller'
import { IContact } from "../src/models/contact.type";
import admin from 'firebase-admin';
import { firebaseUrl } from '../src/config';

describe('Test addressbook', () => {
  const email: string = 'user-not-exists@contactmail.dom';
  let testUser: IUser;
  let userId: string;
  let testContact: IContact;

  beforeAll(async () => {
    testUser = {
      email,
      password: 'myPassword',
    };

    testContact = {
      firstName: "Tomash",
      lastName: "Novak",
      phone: "+4201234567890",
      address: "This is my address"
    };

    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: firebaseUrl,
    });

    await getMongoConnection();
    const uc = new UserController();
    const response = await uc.createUser(testUser);
    userId = response.data?.id || '';
  });

  afterAll(async () => {
    await Users.deleteOne({ email })
  });

  test('Create contact', async () => {
    const ac = new AddrBookController();
    const response = await ac.createContact(userId, testContact);
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.id.length).toBeGreaterThan(0);
  });
});