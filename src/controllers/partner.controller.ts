import * as express from 'express';

import { Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import io from 'socket.io';

import { IControllerBase } from '~/interfaces';
import { UserModel } from '~/models';

class PartnerController implements IControllerBase {
  public path = '/api/user';
  public router = express.Router();
  private io: io.Socket;

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.get(
      `${this.path}/protected`,
      passport.authenticate('jwt', { session: false }),
      this.protected,
    );
    this.router.get(
      `${this.path}/get-partner/:id`,
      passport.authenticate('jwt', { session: false }),
      this.getDialogPartner,
    );
  };

  private getDialogPartner = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    try {
      const partner = await UserModel.findById(id);
      return res.status(200).json(partner);
    } catch (e) {
      return res.status(400).json(e);
    }
  };

  private protected = (req: Request, res: Response) => {
    console.log('im protected');
    return res.status(200).send(req.cookies);
  };
}

export default PartnerController;
