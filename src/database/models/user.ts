import * as Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    index: { unique: true },
  },
  password: String,
  socketId: String,
});

export const User = Mongoose.model('User', userSchema);
