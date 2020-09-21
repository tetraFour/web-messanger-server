import * as express from 'express';
import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import io from 'socket.io';

import { MessageModel, MessageContentModel } from '~/models';
import { IControllerBase } from '~/interfaces';
import { IMessageModel } from '~/models/message.model';

class MessageController implements IControllerBase {
  public path = '/api/message';
  public router = express.Router();
  private io: io.Socket;

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
    // const { ut } = req.cookies;

    // console.log(ut);
    //
    // const decoded = jwt.verify(ut, process.env.JWT_SECRET as string);
    // console.log(decoded);
    try {
      if (user === partner) {
        const onlyMyMessages = await MessageModel.find({
          user: `${user}`,
          partner: `${user}`,
        })
          .populate('content')
          .sort({ date: 1 });
        return res
          .status(200)

          .json(onlyMyMessages);
      }

      const myMessages = await MessageModel.find({
        user: `${user}`,
        partner: `${partner}`,
      })
        .populate('content')
        .sort({ date: 1 });

      const partnerMessages = await MessageModel.find({
        user: `${partner}`,
        partner: `${user}`,
      })
        .populate('content')
        .sort({ date: 1 });

      const finalMessagesList = [...myMessages, ...partnerMessages].sort(
        (a: IMessageModel, b: IMessageModel) =>
          Number(new Date(a.date)) - Number(new Date(b.date)),
      );

      return res
        .status(200)

        .json(finalMessagesList);
    } catch (e) {
      return res
        .status(400)

        .send(e);
    }
  };

  private sendTextMessage = async (req: Request, res: Response) => {
    const { user, partner, flag, content } = req.body;
    try {
      const message = new MessageModel({
        user: user,
        date: new Date(),
        flag,
        partner,
        isRead: false,
      });

      await message.save();

      const messageContent = new MessageContentModel({
        messageText: content.messageText,
      });

      await messageContent.save();

      await MessageModel.findOneAndUpdate(
        { _id: message._id },
        {
          content: messageContent._id,
        },
      );

      return res.status(200).send('message has been sent and saved');
    } catch (e) {
      console.log(e);
      return res.status(400).send(`message hasn't been sent`);
    }
  };
}

export default MessageController;
