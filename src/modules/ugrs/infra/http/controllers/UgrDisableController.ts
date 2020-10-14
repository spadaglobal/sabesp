import DisableUgrService from '@modules/ugrs/services/DisableUgrService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UgrDisableController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id: ugr_id } = request.params;

    const disableUgr = container.resolve(DisableUgrService);

    await disableUgr.execute({ ugr_id });

    return response.status(204).json();
  }
}
