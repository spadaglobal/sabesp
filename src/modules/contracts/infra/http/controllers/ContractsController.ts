import CreateContractService from '@modules/contracts/services/CreateContractService';
import FindContractService from '@modules/contracts/services/FindContractService';
import ListContractService from '@modules/contracts/services/ListContractService';
import ListFilteredContractService from '@modules/contracts/services/ListFilteredContractService';
import UpdateContractService from '@modules/contracts/services/UpdateContractService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ContractsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, exclude = false, name = '' } = request.query;

    if (name) {
      const listContracts = container.resolve(ListFilteredContractService);

      const contracts = await listContracts.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/contracts`,
        },
        entity: 'Contract',
        exclude: exclude as boolean,
        name: name as string,
      });

      return response.json(contracts);
    }
    const listContracts = container.resolve(ListContractService);

    const contracts = await listContracts.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/contracts`,
      },
      entity: 'Contract',
      exclude: exclude as boolean,
    });

    return response.json(contracts);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { title, description, objective, enabled } = request.body;

    const createContract = container.resolve(CreateContractService);

    const contract = await createContract.execute({
      title,
      description,
      objective,
      enabled,
    });

    return response.json(contract);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: contract_id } = request.params;
    const { title, description, objective, enabled } = request.body;

    const updateContract = container.resolve(UpdateContractService);

    const contract = await updateContract.execute({
      contract_id,
      title,
      description,
      objective,
      enabled,
    });

    return response.json(contract);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: contract_id } = request.params;

    const findContract = container.resolve(FindContractService);

    const contract = await findContract.execute({
      contract_id,
    });

    return response.json(contract);
  }
}
