import { config } from '../config';
import { databaseInit } from '../database/database';
import { start } from '../server';

before(async function () {
  this.timeout(120000);
  await databaseInit(true).then(start).then((app) => {
    return app.listen(config.port, config.host);
  });
});
