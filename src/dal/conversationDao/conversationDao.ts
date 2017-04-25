import { Conversation } from './../../database/models/conversation';

export function findAll(): Promise<any[]> {
  return Conversation.find({});
}

export function create(conversation: any): Promise<any> {
  return new Conversation(conversation).save();
}
