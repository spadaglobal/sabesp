import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';

export default interface ICreateLvsDTO {
  contract_id: string;
  date_start: Date;
  date_end?: Date;
  time_start: Date;
  time_end?: Date;
  task_start_id: string;
  task_end_id: string;
  task_type_id: string;
  ugr_id: string;
  group_id: string;
  address: string;
  team_id: string;
  order_id?: string;
  no_order?: string;
  contractor_id: string;
  observation_first?: string;
  observation_second?: string;
  observation_third?: string;
  observation_fourth?: string;
  location?: string;
  user_id: string;
  status: string;
  requirements?: Requirement[];
}
