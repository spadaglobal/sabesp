import ICreateTaskDTO from '../dtos/ICreateTaskDTO';
import Task from '../infra/typeorm/entities/Task';

export default interface ITasksRepository {
  findById(id: string): Promise<Task | undefined>;
  create(data: ICreateTaskDTO): Promise<Task>;
  remove(task: Task): Promise<void>;
  save(task: Task): Promise<Task>;
}
