import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IUgrsRepository from '../repositories/IUgrsRepository';

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
class ListUgrService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
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
    let ugrs = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `ugrs-list:${options.page}:${exclude}`,
    );

    if (!ugrs) {
      if (exclude === false) {
        ugrs = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['groups'],
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        ugrs = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['groups'],
            where: { enabled: true },
            order: {
              created_at: 'DESC',
            },
          },
        });
      }

      await this.cacheProvider.save(
        `ugrs-list:${options.page}:${exclude}`,
        ugrs,
      );
    }

    return ugrs;
  }
}

export default ListUgrService;
