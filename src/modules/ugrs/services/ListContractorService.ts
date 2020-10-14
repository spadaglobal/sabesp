import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IContractorsRepository from '../repositories/IContactorsRepository';

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
class ListContractorService {
  constructor(
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
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
    let contractors = await this.cacheProvider.recover<
      IPaginationResponseDTO | []
    >(`contractors-list:${options.page}:${exclude}`);

    if (!contractors) {
      if (exclude === false) {
        contractors = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['ugrs', 'contract'],
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        contractors = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['ugrs', 'contract'],
            where: { enabled: true },
            order: {
              created_at: 'DESC',
            },
          },
        });
      }

      await this.cacheProvider.save(
        `contractors-list:${options.page}:${exclude}`,
        contractors,
      );
    }

    return contractors;
  }
}

export default ListContractorService;
