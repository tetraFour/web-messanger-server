import * as express from 'express';

import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import { IControllerBase } from 'interfaces';

class UserController implements IControllerBase {
  public path = '/api/user';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.get(
      `${this.path}/protected`,
      passport.authenticate('jwt', { session: false }),
      this.protected,
    );
  };

  private protected = (req: Request, res: Response) => {
    console.log('im protected');
    return res.status(200).send('im protected');
  };
}

export default UserController;
