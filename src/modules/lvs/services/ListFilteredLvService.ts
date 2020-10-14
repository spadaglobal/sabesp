import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import ILvsRepository from '../repositories/ILvsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  user_id?: string;
  group_id?: string;
  status?: string;
}
@injectable()
class ListFilteredLvService {
  constructor(
    @inject('LvsRepository')
    private lvsRepository: ILvsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
    user_id,
    status,
    group_id,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let lvs = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `lvs-list:${options.page}:${options.limit}:${status}:${user_id}:${group_id}`,
    );

    if (group_id && status) {
      lvs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr', 'group'],
          where: { group: { id: group_id }, status },
          order: {
            created_at: 'DESC',
          },
        },
      });
    } else if (user_id && status) {
      lvs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr', 'group'],
          where: { user_id, status },
          order: {
            created_at: 'DESC',
          },
        },
      });
    } else if (user_id) {
      lvs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr', 'group'],
          where: { user_id },
          order: {
            created_at: 'DESC',
          },
        },
      });
    } else if (status) {
      lvs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr', 'group'],
          where: { status },
          order: {
            created_at: 'DESC',
          },
        },
      });
    } else {
      lvs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr', 'group'],
          where: { status: 'open' },
          order: {
            created_at: 'DESC',
          },
        },
      });
    }

    await this.cacheProvider.save(
      `lvs-list:${options.page}:${options.limit}:${status}:${user_id}:${group_id}`,
      lvs,
    );

    return lvs;
  }
}

export default ListFilteredLvService;
