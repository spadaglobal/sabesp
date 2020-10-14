import ICreateTaskDTO from '@modules/tasks/dtos/ICreateTaskDTO';
import Task from '@modules/tasks/infra/typeorm/entities/Task';
import { uuid } from 'uuidv4';

import ITasksRepository from '../ITasksRepository';

class FakeTasksRepository implements ITasksRepository {
  private tasks: Task[] = [];

  public async findById(id: string): Promise<Task | undefined> {
    const taskFound = this.tasks.find(task => task.id === id);
    return taskFound;
  }

  public async create(taskData: ICreateTaskDTO): Promise<Task> {
    const task = new Task();
    Object.assign(task, { id: uuid() }, taskData);

    this.tasks.push(task);

    return task;
  }

  public async remove(task: Task): Promise<void> {
    const findIndexTask = this.tasks.findIndex(
      findTask => findTask.id === task.id,
    );

    this.tasks.splice(findIndexTask, 1);
  }

  public async save(task: Task): Promise<Task> {
    const findIndex = this.tasks.findIndex(findTask => findTask.id === task.id);
    this.tasks[findIndex] = task;
    return task;
  }
}

export default FakeTasksRepository;
