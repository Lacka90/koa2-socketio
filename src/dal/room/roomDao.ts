import { Room } from './../../database/models/room';

export class RoomDao {
  private static instance: RoomDao = null;

  public static getInstance() {
    if (!RoomDao.instance) {
      RoomDao.instance = new RoomDao();
    }
    return RoomDao.instance;
  }
  
  async getByUserId(userId: string) {
    return Room.findOne({
      owner: userId,
    }).lean();
  }

  async createWithOffer(userId: string, offer: string) {
    const room = await this.getByUserId(userId);
    if (room) {
      return Room.findByIdAndUpdate(room._id, {
        offer,
        answer: null,
      });
    }
    return Room.create({
      owner: userId,
      offer,
    });
  }

  async updateWithAnswer(userId: string, answer: string) {
    return Room.findOneAndUpdate({
      owner: userId,
    }, {
      answer,
    }).lean();
  }
}
