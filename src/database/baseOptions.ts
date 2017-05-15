import * as Mongoose from 'mongoose';

export function baseOptionsPlugin (schema: Mongoose.Schema) {
  schema.set('timestamps', true);
  schema.set('versionKey', false);
  schema.set('toJSON', {
    virtuals: true,
  });
  schema.set('toObject', {
    virtuals: true,
  });
}
