import { config } from '../config';
import { databaseInit } from '../database/database';
import { start } from '../server';

before(async () => {
  await databaseInit().then(start).then((app) => {
    return app.listen(config.port, config.host);
  });
});
