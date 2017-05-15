import * as bluebird from 'bluebird';
import * as Mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import { config } from '@core/config';
import { baseOptionsPlugin } from './baseOptions'

Mongoose.plugin(baseOptionsPlugin);

async function init(isTest: boolean) {
  const baseUrl = isTest ? 'mongodb://local-mock' : config.database.url;
  const uri = `${baseUrl}/${config.database.collectionName}`;

  if (isTest) {
    const mockgoose = new Mockgoose(Mongoose);

    return mockgoose.prepareStorage().then(() => {
      return new Promise((resolve, reject) => {
        (Mongoose as any).Promise = bluebird;
        Mongoose.connect(uri, (error) => {
          if (error) {
            reject();
          }
          resolve();
        });
      })
    });
  }

  return new Promise((resolve, reject) => {
    (Mongoose as any).Promise = bluebird;
    Mongoose.connect(uri, (error) => {
      if (error) {
        reject();
      }
      resolve();
    });
  });
}

let initPromise;
export function databaseInit(isTest = false) {
  return initPromise || (initPromise = (async () => {
    await init(isTest);
  })());
}
