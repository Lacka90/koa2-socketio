import * as Chance from 'chance';
import { User } from '@core/database/models/user';
const chance = new Chance();

export function generateUsers(amount: number, server) {
  return Promise.all(Array.apply(null, Array(amount)).map(() =>  generateUser(server)));
}

async function generateUser(server) {
  const username = chance.word();
  const password = chance.word();

  const regRes = await server
    .post('/api/v1/auth/register')
    .send({ username, password });

  const loginRes = await server
    .post('/api/v1/auth/login')
    .send({ username, password });

  const token = loginRes.body.token;

  const whoamiRes = await server
      .get('/api/v1/auth/whoami')
      .set('Authorization', `Bearer ${token}`);

  const user = whoamiRes.body.user;

  return { user, token };
}

export async function addSocketIds(users: { user: { id: string } }[]) {
  return Promise.all(users.map((user) => {
    return User.findByIdAndUpdate(user.user.id, { socketId: chance.word() });
  }))
}
