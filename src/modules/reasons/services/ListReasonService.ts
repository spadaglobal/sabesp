import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IReasonsRepository from '../repositories/IReasonsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  requirement_id: string;
}
@injectable()
class ListReasonService {
  constructor(
    @inject('ReasonsRepository')
    private reasonsRepository: IReasonsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
    requirement_id,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let reasons = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `reasons-list:${options.page}:${requirement_id}`,
    );

    if (!reasons) {
      reasons = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: { requirement_id },
        },
      });

      await this.cacheProvider.save(
        `reasons-list:${options.page}:${requirement_id}`,
        reasons,
      );
    }

    return reasons;
  }
}

export default ListReasonService;
