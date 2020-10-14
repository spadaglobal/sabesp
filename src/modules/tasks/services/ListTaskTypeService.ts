import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import ITaskTypesRepository from '../repositories/ITaskTypesRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
}

@injectable()
class ListTaskTypeService {
  constructor(
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let taskTypes = await this.cacheProvider.recover<
      IPaginationResponseDTO | []
    >(`task-types-list:${options.page}`);

    if (!taskTypes) {
      taskTypes = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          order: {
            created_at: 'DESC',
          },
        },
      });

      // Guarda o resultado na cache

      await this.cacheProvider.save(
        `task-types-list:${options.page}`,
        taskTypes,
      );
    }

    return taskTypes;
  }
}

export default ListTaskTypeService;
