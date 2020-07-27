import 'config/environment.config';
import 'config/passport.config';

import express from 'express';
import cors from 'cors';
import passport from 'passport';

import App from 'app';

import { LoggerMiddleware } from './middleware';
import { AuthController, MessageController } from './controllers';
const app = new App({
  port: parseInt(process.env.PORT as string),
  controllers: [new AuthController(), new MessageController()],
  middlewares: [
    express.json(),
    express.urlencoded({ extended: true }),
    LoggerMiddleware,
    passport.initialize(),
    cors(),
  ],
});

app.listen();
