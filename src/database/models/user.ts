import * as Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  connection: String,
});

export const User = Mongoose.model('User', userSchema);
