import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import ITaskTypesRepository from '../repositories/ITaskTypesRepository';

interface IRequest {
  task_type_id: string;
}

@injectable()
class DeleteTaskTypeService {
  constructor(
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ task_type_id }: IRequest): Promise<void> {
    const taskType = await this.taskTypesRepository.findById(task_type_id);

    if (!taskType) {
      throw new AppError('Task not found');
    }

    await this.cacheProvider.invalidatePrefix('task-types-list');

    await this.taskTypesRepository.remove(taskType.id);
  }
}

export default DeleteTaskTypeService;
