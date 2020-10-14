import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import ILvPosRepository from '../repositories/ILvPosRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  user_id?: string;
  status?: string;
}
@injectable()
class ListLvPosService {
  constructor(
    @inject('LvPosRepository')
    private lvPosRepository: ILvPosRepository,
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
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let lvPos = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `lvPos-list:${options.page}`,
    );

    if (!lvPos) {
      if (user_id && status) {
        lvPos = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            where: {
              status,
              user_id,
            },
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        lvPos = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            where: {
              status: 'open',
            },
            order: {
              created_at: 'DESC',
            },
          },
        });
      }
      await this.cacheProvider.save(`lvPos-list:${options.page}`, lvPos);
    }

    return lvPos;
  }
}

export default ListLvPosService;
