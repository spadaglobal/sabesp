import CreateContractorService from '@modules/ugrs/services/CreateContractorService';
import FindContractorService from '@modules/ugrs/services/FindContractorService';
import ListContractorService from '@modules/ugrs/services/ListContractorService';
import ListFilteredContractorService from '@modules/ugrs/services/ListFilteredContractorService';
import UpdateContractorService from '@modules/ugrs/services/UpdateContractorService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ContractororsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, exclude = false, name = '' } = request.query;

    if (name) {
      const listFilteredContractors = container.resolve(
        ListFilteredContractorService,
      );

      const contractors = await listFilteredContractors.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/contractors`,
        },
        entity: 'Contractor',
        exclude: exclude as boolean,
        name: name as string,
      });

      return response.json(contractors);
    }
    const listContractors = container.resolve(ListContractorService);

    const contractors = await listContractors.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/contractors`,
      },
      entity: 'Contractor',
      exclude: exclude as boolean,
    });

    return response.json(contractors);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      contract_id,
      contract_number,
      name,
      prefix,
      ugr_ids,
      enabled,
    } = request.body;

    const createContractor = container.resolve(CreateContractorService);

    const contractor = await createContractor.execute({
      contract_id,
      contract_number,
      name,
      prefix,
      ugr_ids,
      enabled,
    });

    return response.json(contractor);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: contractor_id } = request.params;
    const {
      contract_id,
      contract_number,
      name,
      prefix,
      ugr_ids,
      enabled,
    } = request.body;

    const updateContractor = container.resolve(UpdateContractorService);

    const contractor = await updateContractor.execute({
      contractor_id,
      contract_number,
      contract_id,
      name,
      prefix,
      ugr_ids,
      enabled,
    });

    return response.json(contractor);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: contractor_id } = request.params;

    const findContractor = container.resolve(FindContractorService);

    const contractor = await findContractor.execute({
      contractor_id,
    });

    return response.json(classToClass(contractor));
  }
}
