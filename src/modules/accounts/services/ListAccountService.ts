import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IAccountsRepository from '../repositories/IAccountsRepository';

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
class ListAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
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
    let accounts = await this.cacheProvider.recover<
      IPaginationResponseDTO | []
    >(`accounts-list:${options.page}:${exclude}`);

    if (!accounts) {
      if (exclude === false) {
        accounts = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['tasks'],
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        accounts = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['tasks'],
            where: { enabled: true },
            order: {
              created_at: 'DESC',
            },
          },
        });
      }

      await this.cacheProvider.save(
        `accounts-list:${options.page}:${exclude}`,
        accounts,
      );
    }

    return accounts;
  }
}

export default ListAccountService;
