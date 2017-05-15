import * as assert from 'assert';
import * as supertest from 'supertest';

import { User } from '@core/database/models/user';
import { Room } from '@core/database/models/room';
import { generateUsers } from '@core/utils/test/user';

const server = supertest.agent("http://localhost:3000");

describe('Room', () => {
  before(async () => {
    this.users = await generateUsers(3, server);
  });

  afterEach(async () => {
    await Room.remove({});
  });

  after(async () => {
    await User.remove({});
  });

  async function getOfferAnswer(type: 'offer' | 'answer', token: string, userId: string, connection: string) {
    const offerRes = await server
      .post(`/api/v1/room/${type}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        connection,
      });

    return server
      .get('/api/v1/room')
      .set('Authorization', `Bearer ${token}`);
  }

  describe('/GET room', () => {
    it('user should not GET room object', async () => {
      const user = this.users.pop();
      const roomRes = await server
        .get('/api/v1/room')
        .set('Authorization', `Bearer ${user.token}`);

      assert.equal(roomRes.status, 404);
    });

    it('user should offer room', async () => {
      const user = this.users.pop();
      const connectionStr = 'connection offer';

      const roomRes = await getOfferAnswer('offer', user.token, user.user.id, connectionStr);

      assert.equal(roomRes.status, 200);
      const room = roomRes.body.room;
      assert.equal(room.offer, connectionStr);
    });

    it('user should answer room', async () => {
      const user = this.users.pop();
      const connectionOffer = 'connection offer';
      const connectionAnswer = 'connection answer';

      const offerRes = await getOfferAnswer('offer', user.token, user.user.id, connectionOffer);
      assert.equal(offerRes.status, 200);
      const room = offerRes.body.room;
      assert.equal(room.offer, connectionOffer);

      const answerRes = await getOfferAnswer('answer', user.token, user.user.id, connectionAnswer);
      assert.equal(answerRes.status, 200);
      const updatedRoom = answerRes.body.room;
      assert.equal(updatedRoom.answer, connectionAnswer);
    });
  });
});
