import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Contract from '../infra/typeorm/entities/Contract';
import IContractsRepository from '../repositories/IContractsRepository';

interface IRequest {
  title: string;
  description: string;
  objective: string;
  enabled?: boolean;
}

@injectable()
class CreateContractService {
  constructor(
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    title,
    description,
    objective,
    enabled,
  }: IRequest): Promise<Contract> {
    const checkContractExists = await this.contractsRepository.findByTitle(
      title,
    );

    if (checkContractExists) {
      throw new AppError('A contract is already using this title');
    }

    const contract = await this.contractsRepository.create({
      title,
      description,
      objective,
      enabled,
    });

    await this.cacheProvider.invalidatePrefix('contracts-list');

    return contract;
  }
}

export default CreateContractService;
