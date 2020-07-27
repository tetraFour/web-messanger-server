import mongoose, { Schema, Document } from 'mongoose';
import { IMessageModel } from './message.model';

export interface IMessageContentModel extends Document {
  messageText: string;
  fileName: string;
  fileSize: string;
  fileLink: string;
  photoLink: string[];
  voiceLink: string;
  stickerLink: string;
  message: IMessageModel['user'];
}

const MessageContentSchema: Schema = new Schema({
  messageText: {
    type: Schema.Types.String,
  },
  fileName: {
    type: Schema.Types.String,
  },
  fileSize: {
    type: Schema.Types.String,
  },
  fileLink: {
    type: Schema.Types.String,
  },
  photoLink: {
    type: [Schema.Types.String],
    default: void 0,
  },
  voiceLink: {
    type: Schema.Types.String,
  },
  stickerLink: {
    type: Schema.Types.String,
  },
});

const MessageContentModel = mongoose.model<IMessageContentModel>(
  'MessageContent',
  MessageContentSchema,
);

export default MessageContentModel;
