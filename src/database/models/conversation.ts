import * as Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const conversationSchema = new Schema({
  name: String,
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

export const Conversation = Mongoose.model('Conversation', conversationSchema);
