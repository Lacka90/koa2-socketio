import * as Mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import * as bluebird from 'bluebird';
import { config } from '../config';

function baseOptionsPlugin (schema: Mongoose.Schema) {
  schema.set('timestamps', true);
  schema.set('versionKey', false);
  schema.set('toJSON', {
    virtuals: true,
  });
  schema.set('toObject', {
    virtuals: true,
  });
}

Mongoose.plugin(baseOptionsPlugin);

async function init(isTest: boolean) {
  const baseUrl = isTest ? 'mongodb://localhost:32769' : config.database.url;
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
