import Task from '@modules/tasks/infra/typeorm/entities/Task';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import ITasksRepository from '../repositories/ITasksRepository';

interface IRequest {
  task_id: string;
  description: string;
  type: string;
  enabled: boolean;
}

@injectable()
class UpdateTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    task_id,
    description,
    type,
    enabled,
  }: IRequest): Promise<Task> {
    const task = await this.tasksRepository.findById(task_id);

    if (!task) {
      throw new AppError('Task not found');
    }

    task.description = description;
    task.type = type;
    task.enabled = enabled;

    await this.tasksRepository.save(task);

    await this.cacheProvider.invalidatePrefix('tasks-list');

    return task;
  }
}

export default UpdateTaskService;
