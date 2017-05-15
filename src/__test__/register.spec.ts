import { config } from '@core/config';
import { databaseInit } from '@core/database/database';
import { start } from '@core/server';

before(async function () {
  this.timeout(120000);
  await databaseInit(true).then(start).then((app) => {
    return app.listen(config.port, config.host);
  });
});
