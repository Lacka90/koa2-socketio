import * as assert from 'assert';
import * as supertest from 'supertest';

import { User } from '@core/database/models/user';
import { Room } from '@core/database/models/room';

const server = supertest.agent("http://localhost:3000");

describe('Room', () => {
  before(async () => {
    const regRes = await server
      .post('/api/v1/auth/register')
      .send({ username: 'roomuser', password: 'roompass' });
    assert.equal(regRes.status, 200);

    const loginRes = await server
      .post('/api/v1/auth/login')
      .send({ username: 'roomuser', password: 'roompass' });
    assert.equal(loginRes.status, 200);

    this.token = loginRes.body.token;

    const whoamiRes = await server
        .get('/api/v1/auth/whoami')
        .set('Authorization', `Bearer ${this.token}`);

    this.user = whoamiRes.body.user;
  });

  afterEach(async () => {
    await Room.remove({});
  });

  after(async () => {
    await User.remove({});
  });

  describe('/GET room', () => {
    it('user should not GET room object', async () => {
      const roomRes = await server
        .get('/api/v1/room')
        .set('Authorization', `Bearer ${this.token}`);

      assert.equal(roomRes.status, 404);
    });

    it('user should GET room object', async () => {
      const offerRes = await server
        .post('/api/v1/room/offer')
        .set('Authorization', `Bearer ${this.token}`)
        .send({
          userId: this.user.id,
          connection: 'connection str',
        });

      const roomRes = await server
        .get('/api/v1/room')
        .set('Authorization', `Bearer ${this.token}`);

      assert.equal(roomRes.status, 200);
    });
  });
});
