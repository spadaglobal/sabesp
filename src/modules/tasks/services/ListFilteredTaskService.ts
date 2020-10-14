import { inject, injectable } from 'tsyringe';

import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';
import ILike from '@shared/infra/typeorm/implementations';

import ITasksRepository from '../repositories/ITasksRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  exclude: boolean;
  name: string;
  type: string;
}

@injectable()
class ListFilteredTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
    name,
    type,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let tasks: IPaginationResponseDTO | [] = [];

    if (exclude === false) {
      tasks = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: {
            description: ILike(`%${name}%`),
            type,
          },
        },
      });
    } else {
      tasks = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: { enabled: true, description: ILike(`%${name}%`), type },
        },
      });
    }

    return tasks;
  }
}

export default ListFilteredTaskService;
