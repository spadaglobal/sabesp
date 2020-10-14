import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import ITasksRepository from '../repositories/ITasksRepository';

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
class ListTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
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
    let tasks = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `tasks-list:${options.page}:${exclude}`,
    );

    if (!tasks) {
      if (exclude === false) {
        tasks = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        tasks = await this.paginationProvider.pagination({
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
        `tasks-list:${options.page}:${exclude}`,
        tasks,
      );
    }

    return tasks;
  }
}

export default ListTaskService;
