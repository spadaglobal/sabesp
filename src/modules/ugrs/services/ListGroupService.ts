import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IGroupsRepository from '../repositories/IGroupsRepository';

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
class ListGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
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
    let groups = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `groups-list:${options.page}:${exclude}`,
    );

    if (!groups) {
      if (exclude === false) {
        groups = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['ugr'],
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        groups = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['ugr'],
            where: { enabled: true },
            order: {
              created_at: 'DESC',
            },
          },
        });
      }

      await this.cacheProvider.save(
        `groups-list:${options.page}:${exclude}`,
        groups,
      );
    }

    return groups;
  }
}

export default ListGroupService;
