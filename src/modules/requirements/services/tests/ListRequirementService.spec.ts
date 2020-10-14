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
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListRequirementService from '../ListRequirementService';

let fakeRequirementsRepository: FakeRequirementsRepository;
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
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listRequirement: ListRequirementService;

describe('ListRequirement', () => {
  beforeEach(() => {
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
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
    fakeUsersRepository = new FakeUsersRepository();
    listRequirement = new ListRequirementService(
      fakeRequirementsRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
    });

    const cachedList = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
    });

    await fakeRequirementsRepository.create({
      title: 'Requirement Title 2',
    });

    const cached2List = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all father requirements', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get list by sending lv_id and parent_id', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const requirementFather = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    await fakeRequirementsRepository.create({
      title: 'Requirement Sub Title',
      parent_id: requirementFather.id,
    });

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

    await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: requirementFather.id,
      lv_id: lv.id,
    });

    const cachedList = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: requirementFather.id,
      lv_id: lv.id,
    });

    await fakeRequirementsRepository.create({
      title: 'Requirement Title 2',
    });

    const cached2List = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: requirementFather.id,
      lv_id: lv.id,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get list by sending lv_id', async () => {
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

    await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
      lv_id: lv.id,
    });

    const cachedList = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
      lv_id: lv.id,
    });

    await fakeRequirementsRepository.create({
      title: 'Requirement Title 2',
    });

    const cached2List = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
      lv_id: lv.id,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get list chached', async () => {
    await fakeRequirementsRepository.create({
      title: 'Requirement Title 2',
      parent_id: (null as unknown) as undefined,
    });

    const list = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
    });

    const cache = await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
    });

    expect(cache).toStrictEqual(list);
  });
  it('should be able to get all father requirements', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: '',
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get requirement children', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const parent = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    await listRequirement.execute({
      options: { page: 1, limit: 100 },
      entity: 'Requirement',
      parent_id: parent.id,
    });

    expect(pagination).toBeCalled();
  });
});
