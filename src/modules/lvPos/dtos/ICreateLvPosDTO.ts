import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';

export default interface ICreateLvsDTO {
  contract_id: string;
  date: Date;
  time: Date;
  task_start_id: string;
  task_end_id: string;
  ugr_id: string;
  group_id: string;
  address: string;
  contractor_id: string;
  observation_first?: string;
  observation_second?: string;
  observation_third?: string;
  observation_fourth?: string;
  user_id: string;
  status: string;
  badge_solo?: string;
  badge_capa?: string;
  lv_id?: string;
  location?: string;
  requirements?: Requirement[];
}
