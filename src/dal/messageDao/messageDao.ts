import { Message } from './../../database/models/message';

export function findAll(): Promise<any[]> {
  return Message.find({});
}

export function create(message: any): Promise<any> {
  return new Message(message).save();
}
