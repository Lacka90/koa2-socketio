import * as Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const messageSchema = new Schema({
  name: String,
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
  },
});

export const Message = Mongoose.model('Message', messageSchema);
