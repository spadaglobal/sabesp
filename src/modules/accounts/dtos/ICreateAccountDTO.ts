import Task from '@modules/tasks/infra/typeorm/entities/Task';

export default interface ICreateAccountDTO {
  type: string;
  task_type_id: string;
  code: string;
  tasks: Task[];
  group_id: string;
}
