import { Users } from '../models/user.model';
import { IUser, IUserDocument } from '../models/user.types';
import { validateUser } from '../models/user.validate';
import { TResponse, TResponseError } from '../typings/json-api';
import bcrypt from 'bcrypt';
import { saltRound, secretOrKey, expiresIn, issuer, audience } from '../config';
import jwt from 'jsonwebtoken';

export class UserController {
  public async createUser(payload: IUser): Promise<TResponse> {
    try {
      const validateError = this.validatePayload(payload, 400);
      if (validateError) {
        return validateError;
      }

      let user = await Users.findOne({ email: payload.email.toLowerCase() });
      if (user) {
        return { errors: [{ status: 409, detail: 'User already exists' }] };
      }

      const hash = await bcrypt.hash(payload.password, saltRound);
      user = new Users({
        email: payload.email.toLowerCase(),
        password: hash,
      });
      await user.save();
      return this.createResponse(user);
    } catch (e) {
      return {
        errors: [{ status: 422, detail: e.message }],
      };
    }
  }

  public async loginUser(payload: IUser): Promise<TResponse> {
    try {
      const validateError = this.validatePayload(payload, 400);
      if (validateError) {
        return validateError;
      }

      const user = await Users.findOne({ email: payload.email.toLowerCase() });
      if (!user) {
        return { errors: [{ status: 401, detail: 'User unauthorized' }] };
      }

      const response = await bcrypt.compare(payload.password, user.password);
      if (response) {
        return this.createResponse(user);
      } else {
        return { errors: [{ status: 401, title: 'Unauthorized' }] };
      }
    } catch (e) {
      return { errors: [{ status: 422, title: 'Unprocessable Entity', detail: e.message }] };
    }
  }

  private validatePayload(payload: IUser, status: number): TResponse | undefined {
    if (!validateUser(payload)) {
      const errors = validateUser.errors?.map<TResponseError>(err => {
        return {
          status,
          title: 'Bad Request',
          detail: err.message,
          source: {
            pointer: err.instancePath,
          },
        };
      });

      return { errors };
    }

    return;
  }

  private createToken(email: string): string {
    return `Bearer ${jwt.sign({ email }, secretOrKey, {
      expiresIn,
      issuer,
      audience,
    })}`;
  }

  private createResponse(user: IUserDocument): TResponse {
    return {
      data: {
        type: 'user',
        id: `${user._id}`,
        attributes: { token: this.createToken(user.email) },
      },
    };
  }
}
