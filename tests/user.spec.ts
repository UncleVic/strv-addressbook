//
import { getMongoConnection } from '../src/lib/db';
import { IUser } from '../src/models/user.types'
import { Users } from '../src/models/user.model'
import { UserController } from '../src/controllers/user.controller'
import { TResponseError } from '../src/typings/json-api';

describe('Test users', () => {
  const email: string = 'user-not-exists@nomail.dom';
  let testData: IUser;

  beforeAll(async () => {
    await getMongoConnection();
  });

  beforeEach(() => {
    testData = {
      email,
      password: 'myPassword',
    }
  });

  afterAll(async () => {
    await Users.deleteOne({ email })
  });

  test('Create', async () => {
    const uc = new UserController();
    const response = await uc.createUser(testData);
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.id.length).toBeGreaterThan(0);
    expect(response.data?.attributes?.token).toBeDefined();
  });

  test('Create duble', async () => {
    const uc = new UserController();
    const response = await uc.createUser(testData);
    expect(response.data).toBeUndefined();
    expect(response.errors).toBeDefined();
    expect(Array.isArray(response.errors)).toBeTruthy();
    const err = response.errors ? response.errors[0] : [] as unknown as TResponseError;
    expect(err.status).toEqual(409);
  });

  test('Login', async () => {
    const uc = new UserController();
    const response = await uc.loginUser(testData);
    expect(response.errors).toBeUndefined();
    expect(response.data).toBeDefined();
    expect(response.data?.id.length).toBeGreaterThan(0);
  });

  test('Login with wrong password', async () => {
    const uc = new UserController();
    testData.password = 'wrong';
    const response = await uc.loginUser(testData);
    expect(response.data).toBeUndefined();
    expect(response.errors).toBeDefined();
    expect(Array.isArray(response.errors)).toBeTruthy();
    const err = response.errors ? response.errors[0] : [] as unknown as TResponseError;
    expect(err.status).toEqual(401);
  });
});