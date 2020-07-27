import { Schema, model, Document } from 'mongoose';

export interface IUserModel extends Document {
  _id: string;
  name: string;
  email: string;
  login: string;
  password: string;
  avatar: string;
  online: Date;
  is_verified: boolean;
}

const User = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  login: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  avatar: {
    type: Schema.Types.String,
    default: '',
  },
  online: {
    type: Schema.Types.Date,
    default: new Date(),
  },
  is_verified: {
    type: Schema.Types.Boolean,
    default: false,
  },
  contactList: {
    type: [Schema.Types.String],
    default: void 0,
  },
});

const UserModel = model<IUserModel>('User', User);

export default UserModel;
