import TaskType from '@modules/tasks/infra/typeorm/entities/TaskType';

export default interface ICreateRequirementDTO {
  title: string;
  taskTypes?: TaskType[];
  parent_id?: string;
  type?: string;
}
