import * as Mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import { config } from '../config';

async function init() {
  const baseUrl = config.env === 'test' ? 'mongodb://127.0.0.1:32769' : config.database.url;
  const uri = `${baseUrl}/${config.database.collectionName}`;

  return new Promise((resolve, reject) => {
    (Mongoose as any).Promise = bluebird;
    Mongoose.connect(uri, (error) => {
      if (error) {
        reject();
      }
      resolve();
    });
  })
}

let initPromise;
export function databaseInit() {
  return initPromise || (initPromise = (async () => {
    await init();
  })());
}
