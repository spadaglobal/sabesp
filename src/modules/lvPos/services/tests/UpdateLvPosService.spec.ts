import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeLvPosRepository from '@modules/lvPos/repositories/fakes/FakeLvPosRepository';
import FakeLvsRepository from '@modules/lvs/repositories/fakes/FakeLvsRepository';
import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateLvPosService from '../UpdateLvPosService';

let fakeLvPosRepository: FakeLvPosRepository;
let fakeLvsRepository: FakeLvsRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let fakeTeamsRepository: FakeTeamsRepository;
let fakeTaskRepository: FakeTasksRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateLvPos: UpdateLvPosService;

describe('Update LvPos', () => {
  beforeEach(() => {
    fakeLvPosRepository = new FakeLvPosRepository();
    fakeLvsRepository = new FakeLvsRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeTaskRepository = new FakeTasksRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateLvPos = new UpdateLvPosService(
      fakeLvPosRepository,
      fakeLvsRepository,
      fakeUsersRepository,
      fakeContractsRepository,
      fakeTaskRepository,
      fakeContractorsRepository,
      fakeGroupsRepository,
      fakeUgrsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update a lvPos', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    const lvPosUpdated = await updateLvPos.execute({
      lv_pos_id: lvPos.id,
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address New',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    expect(lvPosUpdated.address).toBe('Address New');
  });
  it('should not be able to update a lvPos if the contract not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: 'non-exists-id',
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        ugr_id: ugr.id,
        group_id: group.id,
        address: 'Address',
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: lv.id,
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a non-exists lvPos', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: 'non-exists-id',
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        ugr_id: ugr.id,
        group_id: group.id,
        address: 'Address',
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: lv.id,
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a lvPos if the task_start not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: 'non-exists-id',
        task_end_id: task.id,
        ugr_id: ugr.id,
        group_id: group.id,
        address: 'Address',
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: lv.id,
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a lvPos if the task_end not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: 'non-exists-id',
        ugr_id: ugr.id,
        group_id: group.id,
        address: 'Address',
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: lv.id,
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a lvPos if the ugr not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        ugr_id: 'non-exists-id',
        group_id: group.id,
        address: 'Address',
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: lv.id,
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a lvPos if the group not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        ugr_id: ugr.id,
        group_id: 'non-exists-id',
        address: 'Address',
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: lv.id,
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a lvPos if the contractor not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        ugr_id: ugr.id,
        group_id: group.id,
        address: 'Address',
        contractor_id: 'non-exists-id',
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: lv.id,
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a lvPos if user is invalid', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        ugr_id: ugr.id,
        group_id: group.id,
        address: 'Address',
        contractor_id: contractor.id,
        status: 'open',
        user_id: 'invalid-id',
        lv_id: lv.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a lvPos if lv is invalid', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await expect(
      updateLvPos.execute({
        lv_pos_id: lvPos.id,
        contract_id: contract.id,
        date: new Date(),
        time: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        ugr_id: ugr.id,
        group_id: group.id,
        address: 'Address',
        contractor_id: contractor.id,
        status: 'open',
        user_id: user.id,
        badge_capa: '',
        badge_solo: '',
        lv_id: 'invalid-id',
        location: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
