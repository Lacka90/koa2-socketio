import * as Boom from 'boom';
import { AuthService } from './../../../services/auth/authService';
import { jwtSign } from '../../../middlewares/jwtMiddleware';
import * as Router from 'koa-router';

export async function authRoute() {
  const router = Router();

  router.get('/whoami', async (ctx) => {
    // console.log(ctx);
    const userId = ctx.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const authService = AuthService.getInstance();
    const user = await authService.whoami(userId);
    ctx.body = { user };
  });

  router.post('/login', async (ctx) => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      throw Boom.badRequest('Username or Password not found');
    }
    const authService = AuthService.getInstance();
    const userId = await authService.login(username, password);
    
    const userData = {
      userId,
    };
    const token = await jwtSign(userData);
    ctx.body = { token };
  });

  router.post('/register', async (ctx) => {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    if (!username || !password) {
      throw Boom.badRequest('Username or Password not found');
    }
    const authService = AuthService.getInstance();
    const user = await authService.register(username, password);
    ctx.body = { user };
  });

  return router;
}
