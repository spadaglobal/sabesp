import Task from '@modules/tasks/infra/typeorm/entities/Task';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import ITasksRepository from '../repositories/ITasksRepository';

interface IRequest {
  description: string;
  enabled: boolean;
  type: string;
}

@injectable()
class CreateTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    description,
    enabled,
    type,
  }: IRequest): Promise<Task> {
    const task = await this.tasksRepository.create({
      description,
      enabled,
      type,
    });

    await this.cacheProvider.invalidatePrefix('tasks-list');

    return task;
  }
}

export default CreateTaskService;
