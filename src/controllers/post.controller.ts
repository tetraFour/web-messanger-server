import * as express from 'express';
import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { MessageModel, MessageContentModel } from '~/models';
import { IControllerBase } from '~/interfaces';
import UserModel from '~/models/user.model';

class PostController implements IControllerBase {
  public path = '/api/post';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.get(
      `${this.path}/get-post-list`,
      passport.authenticate('jwt', { session: false }),
      this.getPostList,
    );
    this.router.get(
      `${this.path}/search`,
      passport.authenticate('jwt', { session: false }),
      this.searchUser,
    );
  };

  private searchUser = async (req: Request, res: Response) => {
    const { username } = req.query;
    if (!username) {
      const allUsers = await UserModel.find();
      res.status(200).json(allUsers);
    }
    const user = await UserModel.find({ name: `${username}` });
    res.status(200).json(user);
  };

  private getPostList = async (req: Request, res: Response) => {
    const user = await UserModel.find();
    const final = user.map(usr => ({
      userId: usr._id,
      avatar: usr.avatar,
      name: usr.name,
    }));
    // console.log(user);
    // console.log(final);

    return res.status(200).json(user);
  };
}

export default PostController;
