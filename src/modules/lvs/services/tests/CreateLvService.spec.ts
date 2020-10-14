import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeLvsRepository from '@modules/lvs/repositories/fakes/FakeLvsRepository';
import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateLvService from '../CreateLvService';

let fakeLvsRepository: FakeLvsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeTaskRepository: FakeTasksRepository;
let fakeTeamsRepository: FakeTeamsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createLv: CreateLvService;

describe('CreateLv', () => {
  beforeEach(() => {
    fakeLvsRepository = new FakeLvsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeTaskRepository = new FakeTasksRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createLv = new CreateLvService(
      fakeLvsRepository,
      fakeUsersRepository,
      fakeContractsRepository,
      fakeTaskRepository,
      fakeTaskTypesRepository,
      fakeContractorsRepository,
      fakeGroupsRepository,
      fakeOrdersRepository,
      fakeTeamsRepository,
      fakeUgrsRepository,
      fakeRequirementsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new lv', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
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

    const lv = await createLv.execute({
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

    expect(lv).toHaveProperty('id');
  });
  it('should be able to create a new lv without order', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
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

    const lv = await createLv.execute({
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
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: 'Observation2',
      observation_third: 'Observation3',
      observation_fourth: 'Observation4',
      status: 'open',
      user_id: user.id,
      no_order: 'No Order',
    });

    expect(lv).toHaveProperty('id');
  });
  it('should not be able to create a new lv if the contract not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
        contract_id: 'non-exists-id',
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the task_start not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
        contract_id: contract.id,
        date_start: new Date(),
        date_end: new Date(),
        time_start: new Date(),
        time_end: new Date(),
        task_start_id: 'non-exists-id',
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the task_end not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
        contract_id: contract.id,
        date_start: new Date(),
        date_end: new Date(),
        time_start: new Date(),
        time_end: new Date(),
        task_start_id: task.id,
        task_end_id: 'non-exists-id',
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the task type not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
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

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
        contract_id: contract.id,
        date_start: new Date(),
        date_end: new Date(),
        time_start: new Date(),
        time_end: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        task_type_id: 'non-exists-id',
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the ugr not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
        contract_id: contract.id,
        date_start: new Date(),
        date_end: new Date(),
        time_start: new Date(),
        time_end: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        task_type_id: taskType.id,
        ugr_id: 'non-exists-id',
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the group not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
        contract_id: contract.id,
        date_start: new Date(),
        date_end: new Date(),
        time_start: new Date(),
        time_end: new Date(),
        task_start_id: task.id,
        task_end_id: task.id,
        task_type_id: taskType.id,
        ugr_id: ugr.id,
        group_id: 'non-exists-id',
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
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the team not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
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

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
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
        team_id: 'non-exists-id',
        order_id: order.id,
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the order not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
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

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
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
        order_id: 'non-exists-id',
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the contractor not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
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

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
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
        contractor_id: 'non-exists-id',
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the user not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    await expect(
      createLv.execute({
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
        user_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new lv if the order_id and no_order not exists', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createLv.execute({
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
        contractor_id: contractor.id,
        observation_first: 'Observation',
        observation_second: '',
        observation_third: '',
        observation_fourth: '',
        status: 'open',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
