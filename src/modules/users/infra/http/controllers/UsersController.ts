import CreateUserService from '@modules/users/services/CreateUserService';
import FindUserService from '@modules/users/services/FindUserService';
import ListFilteredUserService from '@modules/users/services/ListFilteredUserService';
import ListUserService from '@modules/users/services/ListUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, exclude = false, name = '' } = request.query;

    if (name) {
      const listFilteredUsers = container.resolve(ListFilteredUserService);

      const users = await listFilteredUsers.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/users`,
        },
        entity: 'User',
        exclude: exclude as boolean,
        name: name as string,
      });

      return response.json(classToClass(users));
    }

    const listUsers = container.resolve(ListUserService);

    const users = await listUsers.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/users`,
      },
      entity: 'User',
      exclude: exclude as boolean,
    });

    return response.json(classToClass(users));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, role, enabled } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
      role,
      enabled,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, enabled, old_password, role } = request.body;
    const { id: user_id } = request.params;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      user_id,
      name,
      email,
      role,
      enabled,
      password,
      old_password,
    });

    return response.json(classToClass(user));
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.params;

    const findUser = container.resolve(FindUserService);

    const user = await findUser.execute({
      user_id,
    });

    return response.json(classToClass(user));
  }
}
