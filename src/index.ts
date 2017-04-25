import { databaseInit } from './database/database';
import { start } from './server';

databaseInit().then(start);
