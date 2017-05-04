import { User } from './../../database/models/user';

export class UserDao {
  private static instance: UserDao = null;

  public static getInstance() {
    if (!UserDao.instance) {
      UserDao.instance = new UserDao();
    }
    return UserDao.instance;
  }
  
  async getById(userId: string) {
    return User.findById(userId).lean();
  }

  async create(user: any) {
    return new User(user).save();
  }
}
