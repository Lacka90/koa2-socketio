import { Room } from './../../database/models/room';
import { IRoom } from '@core/types/IRoom.d';

export class RoomDao {
  private static instance: RoomDao = null;

  public static getInstance() {
    if (!RoomDao.instance) {
      RoomDao.instance = new RoomDao();
    }
    return RoomDao.instance;
  }
  
  async getByUserId(userId: string) {
    const room = await Room.findOne({
      owner: userId,
    });

    return room as IRoom;
  }

  async createWithOffer(userId: string, offer: string) {
    const room = await this.getByUserId(userId);
    if (room) {
      return Room.findByIdAndUpdate(room.id, {
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
    });
  }
}
