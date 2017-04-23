import * as Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  name: String,
});

export const User = Mongoose.model('User', userSchema);
