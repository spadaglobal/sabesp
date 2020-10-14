import CreateReasonService from '@modules/reasons/services/CreateReasonService';
import DeleteReasonService from '@modules/reasons/services/DeleteReasonService';
import FindReasonService from '@modules/reasons/services/FindReasonService';
import ListReasonService from '@modules/reasons/services/ListReasonService';
import UpdateReasonService from '@modules/reasons/services/UpdateReasonService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ReasonsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, requirement_id = '' } = request.query;

    const listReasons = container.resolve(ListReasonService);

    const reasons = await listReasons.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/reasons`,
      },
      entity: 'Reason',
      requirement_id: requirement_id as string,
    });

    return response.json(reasons);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description, requirement_id } = request.body;

    const createReason = container.resolve(CreateReasonService);

    const reason = await createReason.execute({
      description,
      requirement_id,
    });

    return response.json(reason);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: reason_id } = request.params;
    const { description, requirement_id } = request.body;

    const updateReason = container.resolve(UpdateReasonService);

    const reason = await updateReason.execute({
      reason_id,
      description,
      requirement_id,
    });

    return response.json(reason);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: reason_id } = request.params;

    const findReason = container.resolve(FindReasonService);

    const reason = await findReason.execute({
      reason_id,
    });

    return response.json(reason);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: reason_id } = request.params;

    const deleteReason = container.resolve(DeleteReasonService);

    await deleteReason.execute({
      reason_id,
    });

    return response.status(204).json();
  }
}
