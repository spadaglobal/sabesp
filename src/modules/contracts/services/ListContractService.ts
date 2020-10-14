import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IContractsRepository from '../repositories/IContractsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  exclude: boolean;
}
@injectable()
class ListContractService {
  constructor(
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let contracts = await this.cacheProvider.recover<
      IPaginationResponseDTO | []
    >(`contracts-list:${options.page}:${exclude}`);

    if (!contracts) {
      if (exclude === false) {
        contracts = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        contracts = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            where: { enabled: true },
            order: {
              created_at: 'DESC',
            },
          },
        });
      }

      await this.cacheProvider.save(
        `contracts-list:${options.page}:${exclude}`,
        contracts,
      );
    }

    return contracts;
  }
}

export default ListContractService;
