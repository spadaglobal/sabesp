import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import '../infra/typeorm';
import '@shared/container';

import { errors } from 'celebrate';
import cors from 'cors';
import express, { Request, Response, NextFunction, Express } from 'express';

import uploadConfig from '../../config/upload';
import AppError from '../errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

class App {
  server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(rateLimiter);
    this.server.use(cors());
    this.server.use(express.json());
    // Change it to uploads folder
    this.server.use('/images', express.static(uploadConfig.tmpFolder));
  }

  routes() {
    this.server.use(routes);
    this.server.use(errors());
  }

  exceptionHandler() {
    this.server.use(
      (err: Error, request: Request, response: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
          });
        }
        console.error(err.message);
        return response.status(500).json({
          status: 'error',
          message: 'Internal server error',
        });
      },
    );
  }
}

export default new App().server;
