import * as Boom from 'boom';
import * as Router from 'koa-router';
import { UserService } from '@core/services/user/userService';

export async function userRoute() {
  const router = Router();

  router.get('/available', async (ctx) => {
    const userId = ctx.userId;
    if (!userId) {
      throw Boom.notFound('UserId not found');
    }
    const userService = UserService.getInstance();
    const users = await userService.availableUsers(userId);
    ctx.body = { users };
  });

  return router;
}
