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
}
@injectable()
class ListLvService {
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
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let lvs = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `lvs-list:${options.page}`,
    );

    if (!lvs) {
      lvs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr', 'group'],
          order: {
            created_at: 'DESC',
          },
        },
      });

      await this.cacheProvider.save(`lvs-list:${options.page}`, lvs);
    }

    return lvs;
  }
}

export default ListLvService;
