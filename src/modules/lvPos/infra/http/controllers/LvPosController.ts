import CreateLvPosService from '@modules/lvPos/services/CreateLvPosService';
import DeleteLvPosService from '@modules/lvPos/services/DeleteLvPosService';
import FindLvPosService from '@modules/lvPos/services/FindLvPosService';
import ListLvPosService from '@modules/lvPos/services/ListLvPosService';
import UpdateLvPosService from '@modules/lvPos/services/UpdateLvPosService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class LvPosPosController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, user_id = '', status = '' } = request.query;

    const listLvPos = container.resolve(ListLvPosService);

    const lvPos = await listLvPos.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/lvPos`,
      },
      entity: 'LvPos',
      user_id: user_id as string,
      status: status as string,
    });

    return response.json(lvPos);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      address,
      contract_id,
      contractor_id,
      date,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      time,
      ugr_id,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      badge_solo,
      badge_capa,
      lv_id,
      location,
    } = request.body;

    const createLvPos = container.resolve(CreateLvPosService);

    const lv = await createLvPos.execute({
      address,
      contract_id,
      contractor_id,
      date,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      time,
      ugr_id,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      badge_solo,
      badge_capa,
      lv_id,
      location,
    });

    return response.json(lv);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: lv_pos_id } = request.params;
    const {
      address,
      contract_id,
      contractor_id,
      date,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      time,
      ugr_id,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      badge_solo,
      badge_capa,
      lv_id,
      location,
    } = request.body;

    const updateLvPos = container.resolve(UpdateLvPosService);

    const lv = await updateLvPos.execute({
      lv_pos_id,
      address,
      contract_id,
      contractor_id,
      date,
      group_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      time,
      ugr_id,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      badge_solo,
      badge_capa,
      lv_id,
      location,
    });

    return response.json(lv);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: lv_pos_id } = request.params;

    const findLvPos = container.resolve(FindLvPosService);

    const lv = await findLvPos.execute({
      lv_pos_id,
    });

    return response.json(lv);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: lv_pos_id } = request.params;
    const deleteLvPos = container.resolve(DeleteLvPosService);

    await deleteLvPos.execute({
      lv_pos_id,
    });

    return response.status(204).json();
  }
}
