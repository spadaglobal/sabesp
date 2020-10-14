import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IContractsRepository from '../repositories/IContractsRepository';

interface IRequest {
  contract_id: string;
}

@injectable()
class DisableContractService {
  constructor(
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ contract_id }: IRequest): Promise<void> {
    const contract = await this.contractsRepository.findById(contract_id);

    if (!contract || !contract.enabled) {
      throw new AppError('Contract not found or it is already disable');
    }

    contract.enabled = false;

    await this.cacheProvider.invalidatePrefix('contracts-list');

    await this.contractsRepository.save(contract);
  }
}

export default DisableContractService;
