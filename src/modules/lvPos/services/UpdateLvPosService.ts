import IContractsRepository from '@modules/contracts/repositories/IContractsRepository';
import ILvsRepository from '@modules/lvs/repositories/ILvsRepository';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';
import IContractorsRepository from '@modules/ugrs/repositories/IContactorsRepository';
import IGroupsRepository from '@modules/ugrs/repositories/IGroupsRepository';
import IUgrsRepository from '@modules/ugrs/repositories/IUgrsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import LvPos from '../infra/typeorm/entities/LvPos';
import ILvPosRepository from '../repositories/ILvPosRepository';

interface IRequest {
  lv_pos_id: string;
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
}

@injectable()
class UpdateLvPosService {
  constructor(
    @inject('LvPosRepository')
    private lvPosRepository: ILvPosRepository,
    @inject('LvsRepository')
    private lvsRepository: ILvsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    lv_pos_id,
    contract_id,
    date,
    time,
    task_start_id,
    task_end_id,
    contractor_id,
    address,
    group_id,
    ugr_id,
    observation_first,
    observation_second,
    observation_third,
    observation_fourth,
    status,
    user_id,
    badge_solo,
    badge_capa,
    lv_id,
    location,
  }: IRequest): Promise<LvPos> {
    const lvPos = await this.lvPosRepository.findById(lv_pos_id);

    if (!lvPos) {
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

    const contractor = await this.contractorsRepository.findById(contractor_id);
    if (!contractor) {
      throw new AppError('Contractor not found!');
    }
    const group = await this.groupsRepository.findById(group_id);
    if (!group) {
      throw new AppError('Group not found!');
    }

    const ugr = await this.ugrsRepository.findById(ugr_id);
    if (!ugr) {
      throw new AppError('Ugr not found!');
    }

    if (lv_id) {
      const lv = await this.lvsRepository.findById(lv_id);
      if (!lv) {
        throw new AppError('LV not found!');
      }
      lvPos.lv_id = lv_id;
    }

    if (typeof observation_first !== 'undefined') {
      lvPos.observation_first = observation_first;
    }
    if (typeof observation_second !== 'undefined') {
      lvPos.observation_second = observation_second;
    }
    if (typeof observation_third !== 'undefined') {
      lvPos.observation_third = observation_third;
    }
    if (typeof observation_fourth !== 'undefined') {
      lvPos.observation_fourth = observation_fourth;
    }
    if (typeof badge_solo !== 'undefined') {
      lvPos.badge_solo = badge_solo;
    }
    if (typeof badge_capa !== 'undefined') {
      lvPos.badge_capa = badge_capa;
    }
    if (typeof location !== 'undefined') {
      lvPos.location = location;
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found!');
    }

    lvPos.contract_id = contract_id;
    lvPos.address = address;
    lvPos.contractor_id = contractor_id;
    lvPos.date = date;
    lvPos.group_id = group_id;
    lvPos.status = status;
    lvPos.task_end_id = task_end_id;
    lvPos.task_start_id = task_start_id;
    lvPos.time = time;
    lvPos.user_id = user_id;
    lvPos.ugr_id = ugr_id;

    await this.cacheProvider.invalidatePrefix('lvPos-list');

    await this.lvPosRepository.save(lvPos);

    return lvPos;
  }
}

export default UpdateLvPosService;
