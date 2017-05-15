import { User } from '@core/database/models/user';

export class AuthDao {
  async register(username: string, passwordHash: string) {
    return new User({
      username,
      password: passwordHash,
    }).save();
  }
}
