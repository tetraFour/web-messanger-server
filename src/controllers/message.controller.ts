import * as express from 'express';

import { Request, Response } from 'express';

import passport from 'passport';

import jwt from 'jsonwebtoken';

import { MessageModel, MessageContentModel } from '~/models';

import { IControllerBase } from '~/interfaces';

class MessageController implements IControllerBase {
  public path = '/api/message';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.post(
      `${this.path}/send-message`,
      passport.authenticate('jwt', { session: false }),
      this.sendTextMessage,
    );
    this.router.get(
      `${this.path}/get-messages`,
      passport.authenticate('jwt', { session: false }),
      this.getMessages,
    );
  };

  private getMessages = async (req: Request, res: Response) => {
    const { user, partner } = req.query;

    console.log(user, partner);

    const myMessages = await MessageModel.find({ user: `${user}` })
      .populate('content')
      .sort({ date: 1 });
    // .limit(5);

    const partnerMessages = await MessageModel.find({
      user: `${partner}`,
    })
      .populate('content')
      .sort({ date: 1 });
    // .limit(5);

    console.log('myMessages', myMessages);
    console.log('partnerMessages', partnerMessages);
    return res
      .status(200)

      .json([...myMessages, ...partnerMessages]);
  };

  private sendTextMessage = async (req: Request, res: Response) => {
    console.log('message has been sent');
    const { userName, partner, flag, content } = req.body;

    const message = new MessageModel({
      user: userName,
      date: new Date(),
      flag,
      partner,
      isRead: false,
    });

    await message.save();

    const messageContent = new MessageContentModel({
      messageText: content.text,
    });

    await messageContent.save();

    await MessageModel.findOneAndUpdate(
      { _id: message._id },
      {
        content: messageContent._id,
      },
    );

    return res.status(200).send('message has been sent and saved');
  };
}

export default MessageController;
