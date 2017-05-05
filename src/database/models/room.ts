import * as Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const roomSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: { unique: true },
  },
  offer: String,
  answer: String,
});

export const Room = Mongoose.model('Room', roomSchema);
