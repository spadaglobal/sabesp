import CreateUgrService from '@modules/ugrs/services/CreateUgrService';
import FindUgrService from '@modules/ugrs/services/FindUgrService';
import ListFilteredUgrService from '@modules/ugrs/services/ListFilteredUgrService';
import ListUgrService from '@modules/ugrs/services/ListUgrService';
import UpdateUgrService from '@modules/ugrs/services/UpdateUgrService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UgrsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, exclude = false, name = '' } = request.query;

    if (name) {
      const listFilteredUgrs = container.resolve(ListFilteredUgrService);

      const ugrs = await listFilteredUgrs.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/ugrs`,
        },
        entity: 'Ugr',
        exclude: exclude as boolean,
        name: name as string,
      });

      return response.json(ugrs);
    }
    const listUgrs = container.resolve(ListUgrService);

    const ugrs = await listUgrs.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/ugrs`,
      },
      entity: 'Ugr',
      exclude: exclude as boolean,
    });

    return response.json(ugrs);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, enabled } = request.body;

    const createUgr = container.resolve(CreateUgrService);

    const ugr = await createUgr.execute({
      name,
      enabled,
    });

    return response.json(ugr);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: ugr_id } = request.params;
    const { name, enabled } = request.body;

    const updateUgr = container.resolve(UpdateUgrService);

    const ugr = await updateUgr.execute({
      ugr_id,
      name,
      enabled,
    });

    return response.json(ugr);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: ugr_id } = request.params;

    const findUgr = container.resolve(FindUgrService);

    const ugr = await findUgr.execute({
      ugr_id,
    });

    return response.json(ugr);
  }
}
