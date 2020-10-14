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
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListLvPosService from '../ListLvPosService';

let fakeLvPosRepository: FakeLvPosRepository;
let fakeLvsRepository: FakeLvsRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let fakeTeamsRepository: FakeTeamsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeTaskRepository: FakeTasksRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listLvPos: ListLvPosService;

describe('ListLvPos', () => {
  beforeEach(() => {
    fakeLvPosRepository = new FakeLvPosRepository();
    fakeLvsRepository = new FakeLvsRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeTaskRepository = new FakeTasksRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listLvPos = new ListLvPosService(
      fakeLvPosRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

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

    await fakeLvPosRepository.create({
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

    await listLvPos.execute({
      options: { page: 1, limit: 100 },
      entity: 'LvPos',
    });

    const cachedList = await listLvPos.execute({
      options: { page: 1, limit: 100 },
      entity: 'LvPos',
    });

    await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address2',
      contractor_id: contractor.id,
      observation_first: 'Observation2',
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

    const cached2List = await listLvPos.execute({
      options: { page: 1, limit: 100 },
      entity: 'LvPos',
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
});
