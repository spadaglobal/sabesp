import ICreateTaskTypeDTO from '@modules/tasks/dtos/ICreateTaskTypeDTO';
import TaskType from '@modules/tasks/infra/typeorm/entities/TaskType';
import { uuid } from 'uuidv4';

import ITaskTypesRepository from '../ITaskTypesRepository';

class FakeTaskTypesRepository implements ITaskTypesRepository {
  private taskTypes: TaskType[] = [];

  public async findById(id: string): Promise<TaskType | undefined> {
    const taskTypeFound = this.taskTypes.find(taskType => taskType.id === id);
    return taskTypeFound;
  }

  public async create(taskTypeData: ICreateTaskTypeDTO): Promise<TaskType> {
    const taskType = new TaskType();
    Object.assign(taskType, { id: uuid() }, taskTypeData);

    this.taskTypes.push(taskType);

    return taskType;
  }

  public async remove(id: string): Promise<void> {
    const findIndexTask = this.taskTypes.findIndex(
      findTask => findTask.id === id,
    );

    this.taskTypes.splice(findIndexTask, 1);
  }

  public async save(taskType: TaskType): Promise<TaskType> {
    const findIndex = this.taskTypes.findIndex(
      findTaskType => findTaskType.id === taskType.id,
    );
    this.taskTypes[findIndex] = taskType;
    return taskType;
  }
}

export default FakeTaskTypesRepository;
