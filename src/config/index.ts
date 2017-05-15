import * as path from 'path';
import * as dotenv from 'dotenv';
import * as convict from 'convict';

dotenv.config({
  silent: true,
});

/**
 * Schema of the config file made with convict
 * @type {Object}
 */
const conf = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'dev', 'test'],
    default: 'dev',
    env: 'NODE_ENV',
    arg: 'env',
  },
  host: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '127.0.0.1',
    env: 'HOST',
    arg: 'host',
  },
  port: {
    doc: 'The port to bind.',
    format: Number,
    default: 3000,
    env: 'PORT',
    arg: 'port',
  },
  database: {
    url: {
      doc: 'Database connection URL.',
      format: String,
      default: 'mongodb://localhost:32773',
      env: 'DB_URL',
      arg: 'url',
    },
    collectionName: {
      doc: 'Database collection name',
      format: String,
      default: 'default-webrtc',
      env: 'DB_COLLECTION',
      arg: 'collectionName',
    }
  },
  jwt: {
    secret: {
      doc: 'JWT secret salt.',
      format: String,
      default: 'sajtospiciponi',
      env: 'JWT_SECRET',
      arg: 'secret',
    },
    expires: {
      doc: 'JWT expiration time.',
      format: String,
      default: '1h',
      env: 'JWT_EXPIRE',
      arg: 'expire',
    },
    algorithm: {
      doc: 'JWT algorithm.',
      format: String,
      default: 'HS256',
      env: 'JWT_ALGORITHM',
      arg: 'algorithm',
    },
  }
} as any);

// Load environment dependent configuration
const env = conf.get('env');
conf.loadFile(path.normalize(`${__dirname}/${env}.json`));

// Perform validation
conf.validate({allowed: 'strict'});

export const config = conf.getProperties() as any;
