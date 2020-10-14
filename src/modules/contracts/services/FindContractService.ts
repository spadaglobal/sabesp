import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Contract from '../infra/typeorm/entities/Contract';
import IContractsRepository from '../repositories/IContractsRepository';

interface IRequest {
  contract_id: string;
}

@injectable()
class FindContractService {
  constructor(
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
  ) {}

  public async execute({ contract_id }: IRequest): Promise<Contract> {
    const contract = await this.contractsRepository.findById(contract_id);

    if (!contract) {
      throw new AppError('Contract not found!');
    }

    return contract;
  }
}

export default FindContractService;
