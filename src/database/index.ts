import * as Mongoose from 'mongoose';
import * as bluebird from 'bluebird';

async function initDatabase() {
  const uri = 'mongodb://localhost:32773/serversocket'
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
export function init() {
  return initPromise || (initPromise = (async () => {
    await initDatabase();
  })());
}
