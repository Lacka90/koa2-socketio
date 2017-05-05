import * as Mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import { config } from '../config/index';

async function init() {
  const uri = `${config.database.url}/ionic-webrtc`;
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
