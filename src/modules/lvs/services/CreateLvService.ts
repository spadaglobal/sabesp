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
class CreateLvService {
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

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found!');
    }

    if (order_id) {
      const order = await this.ordersRepository.findById(order_id);
      if (!order) {
        throw new AppError('Order not found!');
      }
    }

    const team = await this.teamsRepository.findById(team_id);
    if (!team) {
      throw new AppError('Team not found!');
    }
    const ugr = await this.ugrsRepository.findById(ugr_id);
    if (!ugr) {
      throw new AppError('Ugr is not found!');
    }

    const requirements = await this.requirementsRepository.findByTaskType(
      task_type_id,
    );

    if (!order_id && !no_order) {
      throw new AppError('You must send the no_order field!');
    }
    const lv = await this.lvsRepository.create({
      contract_id,
      address,
      contractor_id,
      date_end,
      date_start,
      group_id,
      order_id,
      status,
      user_id,
      task_end_id,
      task_start_id,
      task_type_id,
      team_id,
      time_end,
      time_start,
      ugr_id,
      no_order,
      observation_first,
      observation_fourth,
      observation_second,
      observation_third,
      location,
      requirements,
    });

    await this.cacheProvider.invalidatePrefix('lvs-list');

    return lv;
  }
}

export default CreateLvService;
