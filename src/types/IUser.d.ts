import { IModel } from './IModel.d';

export interface IUser extends IModel {
  socketId?: string;
}