// src/modules/auth/auth.repository.ts
import { UserModel, IUser } from './auth.model.js';

export class AuthRepository {
  async create(data: Pick<IUser, 'email' | 'password' | 'role'>): Promise<IUser> {
    return UserModel.create(data);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }
}
