import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import TaskType from '../infra/typeorm/entities/TaskType';
import ITaskTypesRepository from '../repositories/ITaskTypesRepository';

interface IRequest {
  task_type_id: string;
}

@injectable()
class FindTaskTypeService {
  constructor(
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
  ) {}

  public async execute({ task_type_id }: IRequest): Promise<TaskType> {
    const taskType = await this.taskTypesRepository.findById(task_type_id);

    if (!taskType) {
      throw new AppError('Task Type not found');
    }

    return taskType;
  }
}

export default FindTaskTypeService;
