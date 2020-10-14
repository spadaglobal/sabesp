import DisableContractService from '@modules/contracts/services/DisableContractService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ContractDisableController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id: contract_id } = request.params;

    const disableContract = container.resolve(DisableContractService);

    await disableContract.execute({ contract_id });

    return response.status(204).json();
  }
}
