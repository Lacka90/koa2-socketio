import * as assert from 'assert';
import * as supertest from 'supertest';

import { User } from '@core/database/models/user';
import { Room } from '@core/database/models/room';
import { generateUsers, addSocketIds } from '@core/utils/test/user';

const server = supertest.agent("http://localhost:3000");

describe('User', () => {
  before(async () => {
    this.users = await generateUsers(2, server);
    await addSocketIds(this.users);
    this.moreusers  = await generateUsers(2, server);
  });

  after(async () => {
    await User.remove({});
  });

  describe('/GET available users', () => {
    it('user should GET one user except without me', async () => {
      const user = this.users.pop();
      const usersRes = await server
        .get('/api/v1/user/available')
        .set('Authorization', `Bearer ${user.token}`);

      assert.equal(usersRes.status, 200);
      const users = usersRes.body.users;
      assert.equal(users.length, 1);
    });

    it('user should GET three user except without me', async () => {
      await addSocketIds(this.moreusers);
      const user = this.users.pop();
      const usersRes = await server
        .get('/api/v1/user/available')
        .set('Authorization', `Bearer ${user.token}`);

      assert.equal(usersRes.status, 200);
      const users = usersRes.body.users;
      assert.equal(users.length, 3);
    });
  });
});
