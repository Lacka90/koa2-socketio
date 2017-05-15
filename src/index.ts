require('module-alias/register');

import { databaseInit } from './database/database';
import { start } from './server';
import { config } from './config';

databaseInit().then(start).then((app) => {
  app.listen(config.port, config.host);
});
