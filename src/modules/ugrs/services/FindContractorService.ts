import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Contractor from '../infra/typeorm/entities/Contractor';
import IContractorsRepository from '../repositories/IContactorsRepository';

interface IRequest {
  contractor_id: string;
}

@injectable()
class FindContractorService {
  constructor(
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
  ) {}

  public async execute({ contractor_id }: IRequest): Promise<Contractor> {
    const contractor = await this.contractorsRepository.findById(contractor_id);

    if (!contractor) {
      throw new AppError('Contractor not found');
    }

    return contractor;
  }
}

export default FindContractorService;
