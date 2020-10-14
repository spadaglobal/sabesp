import IContractsRepository from '@modules/contracts/repositories/IContractsRepository';
import Ugr from '@modules/ugrs/infra/typeorm/entities/Ugr';
import IUgrsRepository from '@modules/ugrs/repositories/IUgrsRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Contractor from '../infra/typeorm/entities/Contractor';
import IContractorsRepository from '../repositories/IContactorsRepository';

interface IRequest {
  contract_number: string;
  name: string;
  contract_id: string;
  prefix: string;
  enabled?: boolean;
  ugr_ids: string[];
}

@injectable()
class CreateContractorService {
  constructor(
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    contract_number,
    name,
    contract_id,
    prefix,
    ugr_ids,
    enabled,
  }: IRequest): Promise<Contractor> {
    const checkContractorExists = await this.contractorsRepository.findByContractNumber(
      contract_number,
    );

    if (checkContractorExists) {
      throw new AppError('A contractor is already using this contract number');
    }

    const checkContractExists = await this.contractsRepository.findById(
      contract_id,
    );

    if (!checkContractExists) {
      throw new AppError('This contract not exists');
    }

    const ugrs: Ugr[] = [];

    await Promise.all(
      ugr_ids.map(async ugr_id => {
        const checkUgrExists = await this.ugrsRepository.findById(ugr_id);

        if (!checkUgrExists) {
          throw new AppError('This ugr not exists');
        }
        ugrs.push(checkUgrExists);
      }),
    );

    const contractor = await this.contractorsRepository.create({
      contract_number,
      name,
      contract_id,
      prefix,
      ugrs,
      enabled,
    });

    await this.cacheProvider.invalidatePrefix('contractors-list');

    return contractor;
  }
}

export default CreateContractorService;
