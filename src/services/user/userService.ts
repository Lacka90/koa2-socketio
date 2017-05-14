import * as Boom from 'boom';
import { UserDao } from '../../dal/user/userDao';
import { RoomDao } from '../../dal/room/roomDao';

export class UserService {
  private static instance: UserService = null;

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  
  async getById(userId: string) {
    const userDao = UserDao.getInstance();
    const user = await userDao.getById(userId);

    if (!user) {
      throw Boom.notFound('user not found', userId);
    }

    return user;
  }

  async getBySocketId(socketId: string) {
    const userDao = UserDao.getInstance();
    const user = await userDao.getBySocketId(socketId);

    if (!user) {
      throw Boom.notFound('user not found by socketid', socketId);
    }

    return user;
  }

  async login(username: string, passwordHash: string) {
    const userDao = UserDao.getInstance();
    const user = await userDao.findByNameAndPass(username, passwordHash);

    return user;
  }

  async register(username: string, passwordHash: string) {
    const userDao = UserDao.getInstance();
    const user = await userDao.create({
      username,
      password: passwordHash,
    });

    return user;
  }

  async availableUsers(userId: string) {
    const userDao = UserDao.getInstance();

    return userDao.getAvailableUsers(userId);
  }

  async updateSocketId(userId: string, socketId: string) {
    const userDao = UserDao.getInstance();

    return userDao.updateSocketId(userId, socketId);
  }
}
