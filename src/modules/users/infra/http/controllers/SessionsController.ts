import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FindUserService from '@modules/users/services/FindUserService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const findAuthenticateUser = container.resolve(FindUserService);

    const user = await findAuthenticateUser.execute({ user_id: id });

    return response.json(classToClass(user));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({ email, password });

    return response.json({ user: classToClass(user), token });
  }
}
