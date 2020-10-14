import CreateGroupService from '@modules/ugrs/services/CreateGroupService';
import FindGroupService from '@modules/ugrs/services/FindGroupService';
import ListFilteredGroupService from '@modules/ugrs/services/ListFilteredGroupService';
import ListGroupService from '@modules/ugrs/services/ListGroupService';
import UpdateGroupService from '@modules/ugrs/services/UpdateGroupService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class GroupsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, exclude = false, name = '' } = request.query;

    if (name) {
      const listFilteredGroups = container.resolve(ListFilteredGroupService);

      const groups = await listFilteredGroups.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/groups`,
        },
        entity: 'Group',
        exclude: exclude as boolean,
        name: name as string,
      });

      return response.json(groups);
    }
    const listGroups = container.resolve(ListGroupService);

    const groups = await listGroups.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/groups`,
      },
      entity: 'Group',
      exclude: exclude as boolean,
    });

    return response.json(groups);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, enabled, ugr_id } = request.body;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      name,
      enabled,
      ugr_id,
    });

    return response.json(group);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: group_id } = request.params;
    const { name, enabled } = request.body;

    const updateGroup = container.resolve(UpdateGroupService);

    const group = await updateGroup.execute({
      group_id,
      name,
      enabled,
    });

    return response.json(group);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: group_id } = request.params;

    const findGroup = container.resolve(FindGroupService);

    const group = await findGroup.execute({
      group_id,
    });

    return response.json(group);
  }
}
