import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Contract from '../infra/typeorm/entities/Contract';
import IContractsRepository from '../repositories/IContractsRepository';

interface IRequest {
  contract_id: string;
  title: string;
  description: string;
  objective: string;
  enabled?: boolean;
}

@injectable()
class UpdateContractService {
  constructor(
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    contract_id,
    title,
    description,
    objective,
    enabled,
  }: IRequest): Promise<Contract> {
    const contract = await this.contractsRepository.findById(contract_id);

    if (!contract) {
      throw new AppError('Contract not found!');
    }

    contract.title = title;
    contract.description = description;
    contract.objective = objective;

    if (typeof enabled !== 'undefined') contract.enabled = enabled;

    await this.contractsRepository.save(contract);

    await this.cacheProvider.invalidatePrefix('contracts-list');

    return contract;
  }
}

export default UpdateContractService;
