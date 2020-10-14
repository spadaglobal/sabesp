import ICreateTaskTypeDTO from '../dtos/ICreateTaskTypeDTO';
import TaskType from '../infra/typeorm/entities/TaskType';

export default interface ITaskTypesRepository {
  findById(id: string): Promise<TaskType | undefined>;
  create(data: ICreateTaskTypeDTO): Promise<TaskType>;
  remove(id: string): Promise<void>;
  save(task: TaskType): Promise<TaskType>;
}
