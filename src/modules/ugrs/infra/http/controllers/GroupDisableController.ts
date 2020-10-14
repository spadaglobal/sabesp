import DisableGroupService from '@modules/ugrs/services/DisableGroupService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class GroupDisableController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id: group_id } = request.params;

    const disableGroup = container.resolve(DisableGroupService);

    await disableGroup.execute({ group_id });

    return response.status(204).json();
  }
}
