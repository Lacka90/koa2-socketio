import { User } from '../../../database/models/user';
import { config } from '../../../config';

import * as supertest from 'supertest';
import * as assert from 'assert';

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
