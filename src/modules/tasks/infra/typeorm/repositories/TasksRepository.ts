import ICreateTaskDTO from '@modules/tasks/dtos/ICreateTaskDTO';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';
import { Repository, getRepository } from 'typeorm';

import Task from '../entities/Task';

class TasksRepository implements ITasksRepository {
  private ormRepository: Repository<Task>;

  constructor() {
    this.ormRepository = getRepository(Task);
  }

  public async findById(id: string): Promise<Task | undefined> {
    const task = await this.ormRepository.findOne(id);
    return task;
  }

  public async create(taskData: ICreateTaskDTO): Promise<Task> {
    const task = this.ormRepository.create(taskData);
    await this.ormRepository.save(task);
    return task;
  }

  public async remove(task: Task): Promise<void> {
    await this.ormRepository.delete(task);
  }

  public async save(task: Task): Promise<Task> {
    return this.ormRepository.save(task);
  }
}

export default TasksRepository;
