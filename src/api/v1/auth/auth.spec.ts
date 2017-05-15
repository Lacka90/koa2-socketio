import * as assert from 'assert';
import * as supertest from 'supertest';

import { User } from '@core/database/models/user';

const server = supertest.agent("http://localhost:3000");

describe('Auth', () => {
  afterEach(async () => {
    await User.remove({});
  })

  describe('/GET whoami', () => {
    it('it should not GET user object', async () => {
      const res = await server
        .get('/api/v1/auth/whoami');

      assert.equal(res.status, 404);
    });

    it('it should not GET user object when missing token', async () => {
      const whoamiRes = await server
        .get('/api/v1/auth/whoami');
      assert.equal(whoamiRes.status, 404);
    });

    it('it should GET user object when token is ok', async () => {
      const regRes = await server
        .post('/api/v1/auth/register')
        .send({ username: 'testuser', password: 'testpass' });
      assert.equal(regRes.status, 200);

      const loginRes = await server
        .post('/api/v1/auth/login')
        .send({ username: 'testuser', password: 'testpass' });
      assert.equal(loginRes.status, 200);

      const token = loginRes.body.token;

      const whoamiRes = await server
        .get('/api/v1/auth/whoami')
        .set('Authorization', `Bearer ${token}`);
      assert.equal(whoamiRes.status, 200);
    });
  });
});
