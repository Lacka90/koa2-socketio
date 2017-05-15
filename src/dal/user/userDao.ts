import { User } from '@core/database/models/user';

export class UserDao {
  private static instance: UserDao = null;

  public static getInstance() {
    if (!UserDao.instance) {
      UserDao.instance = new UserDao();
    }
    return UserDao.instance;
  }
  
  async getById(userId: string) {
    const user = await User.findById(userId);
    return User.findById(userId);
  }

  async getBySocketId(socketId: string) {
    return User.findOne({ socketId }).lean();
  }

  async findByNameAndPass(username: string, password: string) {
    return User.findOne({
      username,
      password,
    });
  }

  async create(user: any) {
    return new User(user).save();
  }

  async getAvailableUsers(userId: string) {
    return User.find({
      $and: [
        { id: { $ne: userId } },
        { socketId: { $ne: null } },
      ],
    });
  }

  async updateSocketId(userId: string, socketId: string) {
    return User.findByIdAndUpdate(userId, { socketId });
  }
}
