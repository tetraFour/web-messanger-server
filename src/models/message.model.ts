import mongoose, { Schema, Document } from 'mongoose';
import { IUserModel } from './user.model';

export interface IMessageModel extends Document {
  _id: string;
  user: IUserModel['_id'];
  date: Date;
  flag: string;
  partner: IUserModel['_id'];
  isRead: boolean;
}

const MessageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  flag: {
    type: Schema.Types.String,
    required: true,
  },
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isRead: {
    type: Schema.Types.Boolean,
    required: true,
  },
  content: {
    type: Schema.Types.ObjectId,
    ref: 'MessageContent',
  },
});

const MessageModel = mongoose.model<IMessageModel>('Message', MessageSchema);

export default MessageModel;
