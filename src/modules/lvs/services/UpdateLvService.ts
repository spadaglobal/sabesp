import IContractsRepository from '@modules/contracts/repositories/IContractsRepository';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import IRequirementsRepository from '@modules/requirements/repositories/IRequirementsRepository';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';
import ITaskTypesRepository from '@modules/tasks/repositories/ITaskTypesRepository';
import ITeamsRepository from '@modules/teams/repositories/ITeamsRepository';
import IContractorsRepository from '@modules/ugrs/repositories/IContactorsRepository';
import IGroupsRepository from '@modules/ugrs/repositories/IGroupsRepository';
import IUgrsRepository from '@modules/ugrs/repositories/IUgrsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Lv from '../infra/typeorm/entities/Lv';
import ILvsRepository from '../repositories/ILvsRepository';

interface IRequest {
  lv_id: string;
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
}

@injectable()
class UpdateLvService {
  constructor(
    @inject('LvsRepository')
    private lvsRepository: ILvsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    lv_id,
    contract_id,
    date_start,
    date_end,
    time_start,
    time_end,
    task_start_id,
    task_end_id,
    task_type_id,
    contractor_id,
    address,
    group_id,
    order_id,
    team_id,
    ugr_id,
    observation_first,
    observation_second,
    observation_third,
    observation_fourth,
    location,
    no_order,
    status,
    user_id,
  }: IRequest): Promise<Lv> {
    const lv = await this.lvsRepository.findById(lv_id);

    if (!lv) {
      throw new AppError('LV not found!');
    }

    const contract = await this.contractsRepository.findById(contract_id);
    if (!contract) {
      throw new AppError('Contract not found!');
    }
    const task_start = await this.tasksRepository.findById(task_start_id);
    if (!task_start) {
      throw new AppError('Task Start not found!');
    }
    const task_end = await this.tasksRepository.findById(task_end_id);
    if (!task_end) {
      throw new AppError('Task End not found!');
    }
    const task_type = await this.taskTypesRepository.findById(task_type_id);
    if (!task_type) {
      throw new AppError('Task Type not found!');
    }
    const contractor = await this.contractorsRepository.findById(contractor_id);
    if (!contractor) {
      throw new AppError('Contractor not found!');
    }
    const group = await this.groupsRepository.findById(group_id);
    if (!group) {
      throw new AppError('Group not found!');
    }

    const team = await this.teamsRepository.findById(team_id);
    if (!team) {
      throw new AppError('Team not found!');
    }

    const ugr = await this.ugrsRepository.findById(ugr_id);
    if (!ugr) {
      throw new AppError('Ugr is not found!');
    }

    if (typeof no_order !== 'undefined') {
      lv.no_order = no_order;
    }

    if (typeof observation_first !== 'undefined') {
      lv.observation_first = observation_first;
    }
    if (typeof observation_second !== 'undefined') {
      lv.observation_second = observation_second;
    }
    if (typeof observation_third !== 'undefined') {
      lv.observation_third = observation_third;
    }
    if (typeof observation_fourth !== 'undefined') {
      lv.observation_fourth = observation_fourth;
    }
    if (typeof observation_fourth !== 'undefined') {
      lv.observation_fourth = observation_fourth;
    }
    if (typeof location !== 'undefined') {
      lv.location = location;
    }
    if (typeof date_end !== 'undefined') {
      lv.date_end = date_end;
    }
    if (typeof time_end !== 'undefined') {
      lv.time_end = time_end;
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found!');
    }

    if (typeof order_id !== 'undefined') {
      const order = await this.ordersRepository.findById(order_id);
      if (!order) {
        throw new AppError('Order not found!');
      }
      lv.order_id = order_id;
    }

    if (!order_id && !no_order) {
      throw new AppError('You must send the no_order field!');
    }

    const requirements = await this.requirementsRepository.findByTaskType(
      task_type_id,
    );
    if (requirements) {
      lv.requirements = requirements;
    }

    lv.contract_id = contract_id;
    lv.address = address;
    lv.contractor_id = contractor_id;
    lv.date_start = date_start;
    lv.group_id = group_id;
    lv.status = status;
    lv.task_end_id = task_end_id;
    lv.task_start_id = task_start_id;
    lv.task_type_id = task_type_id;
    lv.team_id = team_id;
    lv.time_start = time_start;
    lv.user_id = user_id;
    lv.ugr_id = ugr_id;

    await this.cacheProvider.invalidatePrefix('lvs-list');

    await this.lvsRepository.save(lv);

    return lv;
  }
}

export default UpdateLvService;
