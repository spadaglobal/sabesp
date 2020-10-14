import ICreateTaskTypeDTO from '@modules/tasks/dtos/ICreateTaskTypeDTO';
import ITaskTypesRepository from '@modules/tasks/repositories/ITaskTypesRepository';
import { Repository, getRepository } from 'typeorm';

import TaskType from '../entities/TaskType';

class TaskTypesRepository implements ITaskTypesRepository {
  private ormRepository: Repository<TaskType>;

  constructor() {
    this.ormRepository = getRepository(TaskType);
  }

  public async findById(id: string): Promise<TaskType | undefined> {
    const taskType = await this.ormRepository.findOne(id);
    return taskType;
  }

  public async create(taskTypeData: ICreateTaskTypeDTO): Promise<TaskType> {
    const taskType = this.ormRepository.create(taskTypeData);
    await this.ormRepository.save(taskType);
    return taskType;
  }

  public async remove(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(taskType: TaskType): Promise<TaskType> {
    return this.ormRepository.save(taskType);
  }
}

export default TaskTypesRepository;
