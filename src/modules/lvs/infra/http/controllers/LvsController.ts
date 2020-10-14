import CreateLvService from '@modules/lvs/services/CreateLvService';
import DeleteLvService from '@modules/lvs/services/DeleteLvService';
import FindLvService from '@modules/lvs/services/FindLvService';
import ListFilteredLvService from '@modules/lvs/services/ListFilteredLvService';
import ListLvService from '@modules/lvs/services/ListLvService';
import UpdateLvService from '@modules/lvs/services/UpdateLvService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class LvsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      page = 1,
      limit = 10,
      user_id = '',
      status = '',
      group_id = '',
    } = request.query;

    if (user_id || status || group_id) {
      const listTasks = container.resolve(ListFilteredLvService);

      const tasks = await listTasks.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/lvs`,
        },
        entity: 'Lv',
        user_id: user_id as string,
        group_id: group_id as string,
        status: status as string,
      });

      return response.json(tasks);
    }

    const listLvs = container.resolve(ListLvService);

    const lvs = await listLvs.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/lvs`,
      },
      entity: 'Lv',
    });

    return response.json(lvs);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      address,
      contract_id,
      contractor_id,
      date_end,
      date_start,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      task_type_id,
      team_id,
      time_end,
      time_start,
      ugr_id,
      no_order,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      location,
      order_id,
    } = request.body;

    const createLv = container.resolve(CreateLvService);

    const lv = await createLv.execute({
      address,
      contract_id,
      contractor_id,
      date_end,
      date_start,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      task_type_id,
      team_id,
      time_end,
      time_start,
      ugr_id,
      no_order,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      location,
      order_id,
    });

    return response.json(lv);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: lv_id } = request.params;
    const {
      address,
      contract_id,
      contractor_id,
      date_end,
      date_start,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      task_type_id,
      team_id,
      time_end,
      time_start,
      ugr_id,
      no_order,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      location,
      order_id,
    } = request.body;

    const updateLv = container.resolve(UpdateLvService);

    const lv = await updateLv.execute({
      lv_id,
      address,
      contract_id,
      contractor_id,
      date_end,
      date_start,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      task_type_id,
      team_id,
      time_end,
      time_start,
      ugr_id,
      no_order,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      location,
      order_id,
    });

    return response.json(lv);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: lv_id } = request.params;

    const findLv = container.resolve(FindLvService);

    const lv = await findLv.execute({
      lv_id,
    });

    return response.json(lv);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: lv_id } = request.params;
    const deleteLv = container.resolve(DeleteLvService);

    await deleteLv.execute({
      lv_id,
    });

    return response.status(204).json();
  }
}
