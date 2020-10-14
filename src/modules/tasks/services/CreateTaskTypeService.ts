import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import TaskType from '../infra/typeorm/entities/TaskType';
import ITaskTypesRepository from '../repositories/ITaskTypesRepository';

interface IRequest {
  description: string;
}

@injectable()
class CreateTaskTypeService {
  constructor(
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ description }: IRequest): Promise<TaskType> {
    const taskType = await this.taskTypesRepository.create({
      description,
    });

    await this.cacheProvider.invalidatePrefix('task-types-list');

    return taskType;
  }
}

export default CreateTaskTypeService;
