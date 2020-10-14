import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import ITasksRepository from '../repositories/ITasksRepository';

interface IRequest {
  task_id: string;
}

@injectable()
class DisableTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ task_id }: IRequest): Promise<void> {
    const task = await this.tasksRepository.findById(task_id);

    if (!task) {
      throw new AppError('Task not found');
    }

    if (task.enabled === false) {
      throw new AppError('Task is already disabled');
    }

    task.enabled = false;

    await this.cacheProvider.invalidatePrefix('tasks-list');

    await this.tasksRepository.save(task);
  }
}

export default DisableTaskService;
