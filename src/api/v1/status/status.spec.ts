import * as assert from 'assert';
import * as supertest from 'supertest';

import { User } from '@core/database/models/user';

const server = supertest.agent("http://localhost:3000");

describe('Status', () => {
  describe('/GET status', () => {
    it('it should GET 200 OK', async () => {
      const res = await server
        .get('/api/v1/status');

      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { status: 'OK' });
    });
  });
});
