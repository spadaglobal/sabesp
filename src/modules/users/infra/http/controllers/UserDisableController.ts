import DisableUserService from '@modules/users/services/DisableUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UserDisableController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const disableUser = container.resolve(DisableUserService);

    await disableUser.execute({ user_id: id });

    return response.status(204).json();
  }
}
