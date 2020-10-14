import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IContractorsRepository from '../repositories/IContactorsRepository';

interface IRequest {
  contractor_id: string;
}

@injectable()
class CreateContractorService {
  constructor(
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ contractor_id }: IRequest): Promise<void> {
    const contractor = await this.contractorsRepository.findById(contractor_id);

    if (!contractor) {
      throw new AppError('Contractor not found!');
    }

    if (!contractor.enabled) {
      throw new AppError('Contractor is already disable');
    }

    contractor.enabled = false;

    await this.cacheProvider.invalidatePrefix('contractors-list');

    await this.contractorsRepository.save(contractor);
  }
}

export default CreateContractorService;
