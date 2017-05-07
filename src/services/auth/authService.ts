import * as Boom from 'boom';
import * as _ from 'lodash';
import { UserService } from './../user/userService';
import { AuthDao } from '../../dal/auth/authDao';

export class AuthService {
  private static instance: AuthService = null;

  public static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  async whoami(userId: string) {
    const userService = UserService.getInstance();

    const user = await userService.getById(userId);

    if (!user) {
      throw Boom.notFound('user not found');
    }

    return _.omit(user, ['password']);
  }

  async login(username: string, password: string) {
    const passwordHash = this.encode(password);

    const userService = UserService.getInstance();
    const user = await userService.login(username, passwordHash);

    if (!user) {
      throw new Error('user not found');
    }

    return user._id;
  }

  async register(username: string, password: string) {
    const passwordHash = this.encode(password);

    const userService = UserService.getInstance();
    const user = await userService.register(username, passwordHash);

    return user;
  }

  private encode(string: string) {
    const buffer = new Buffer(string);
    return buffer.toString('base64');
  }

  private decode(stringHash: string) {
    const buffer = new Buffer(stringHash, 'base64');
    return buffer.toString('ascii');
  }
}
