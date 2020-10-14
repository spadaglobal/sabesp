import DisableContractorService from '@modules/ugrs/services/DisableContractorService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ContractorDisableController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id: contractor_id } = request.params;

    const disableContract = container.resolve(DisableContractorService);

    await disableContract.execute({ contractor_id });

    return response.status(204).json();
  }
}
