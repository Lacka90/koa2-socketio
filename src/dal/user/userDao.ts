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

  async findByNameAndPass(username: string, password: string) {
    return User.findOne({
      username,
      password,
    }).lean();
  }

  async create(user: any) {
    return new User(user).save();
  }

  async getAvailableUsers(userId: string) {
    return User.find({
      _id: {
        $ne: userId,
      },
    });
  }

  async updateSocketId(userId: string, socketId: string) {
    return User.findByIdAndUpdate(userId, { socketId });
  }
}
