import { RoomDao } from '../../dal/room/roomDao';

export class RoomService {
  private static instance: RoomService = null;

  public static getInstance() {
    if (!RoomService.instance) {
      RoomService.instance = new RoomService();
    }
    return RoomService.instance;
  }

  async getRoom(userId: string) {
    const roomDao = RoomDao.getInstance();
    return roomDao.getByUserId(userId);
  }

  async createRoom(userId: string, offer: string) {
    const roomDao = RoomDao.getInstance();
    return roomDao.createWithOffer(userId, offer);
  }

  async connectRoom(userId: string, answer: string) {
    const roomDao = RoomDao.getInstance();
    return roomDao.updateWithAnswer(userId, answer);
  }
}