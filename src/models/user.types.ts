import { Model, Document } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
}

export interface IUserWithTimestamp extends IUser {
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = IUserWithTimestamp & Document;

export interface IUserStatics {
  createCard(payload: IUser): Promise<IUserDocument>;
}

export type IUserModel = IUserStatics & Model<IUserDocument>;
