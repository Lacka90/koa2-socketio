import * as Mongoose from 'mongoose';
import * as bluebird from 'bluebird';

async function init() {
  const uri = 'mongodb://localhost:32768/serversocket'
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
