import { model, Schema } from 'mongoose';
import { IUser, IUserDocument, IUserModel, IUserStatics } from './user.types';

export const UserSchema = new Schema<IUser, IUserDocument, IUserStatics>(
  {
    email: {
      type: String,
      required: [true, 'Email have to defined'],
      unique: [true, 'The email is already used'],
      validate: {
        validator: (v: string) =>
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
        message: props => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password have to defined'],
    },
  },
  { timestamps: true }
);

export const Users = model<IUserDocument, IUserModel>('Users', UserSchema);
