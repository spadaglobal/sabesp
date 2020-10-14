import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import TaskType from '../infra/typeorm/entities/TaskType';
import ITaskTypesRepository from '../repositories/ITaskTypesRepository';

interface IRequest {
  task_type_id: string;
  description: string;
}

@injectable()
class UpdateTaskTypeService {
  constructor(
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    task_type_id,
    description,
  }: IRequest): Promise<TaskType> {
    const taskType = await this.taskTypesRepository.findById(task_type_id);

    if (!taskType) {
      throw new AppError('Task Type not found');
    }

    taskType.description = description;

    await this.taskTypesRepository.save(taskType);

    await this.cacheProvider.invalidatePrefix('task-types-list');

    return taskType;
  }
}

export default UpdateTaskTypeService;
