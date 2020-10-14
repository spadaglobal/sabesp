import Task from '@modules/tasks/infra/typeorm/entities/Task';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITasksRepository from '../repositories/ITasksRepository';

interface IRequest {
  task_id: string;
}

@injectable()
class FindTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
  ) {}

  public async execute({ task_id }: IRequest): Promise<Task> {
    const task = await this.tasksRepository.findById(task_id);

    if (!task) {
      throw new AppError('Task not found');
    }
    return task;
  }
}

export default FindTaskService;
