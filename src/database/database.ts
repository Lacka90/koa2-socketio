import * as Mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import * as bluebird from 'bluebird';
import { config } from '../config';

async function init(isTest: boolean) {
  const baseUrl = isTest ? 'mongodb://localhost:32769' : config.database.url;
  const uri = `${baseUrl}/${config.database.collectionName}`;
  console.log(uri)

  if (isTest) {
    const mockgoose = new Mockgoose(Mongoose); // tslint:disable-line

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
