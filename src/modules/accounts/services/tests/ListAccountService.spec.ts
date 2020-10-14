import FakeAccountsRepository from '@modules/accounts/repositories/fakes/FakeAccountsRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListAccountService from '../ListAccountService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeTasksRepository: FakeTasksRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listAccount: ListAccountService;

describe('ListAccount', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeTasksRepository = new FakeTasksRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listAccount = new ListAccountService(
      fakeAccountsRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
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

    await fakeAccountsRepository.create({
      code: 'Code',
      type: 'Investimento',
      task_type_id: taskType.id,
      tasks: [task],
      group_id: group.id,
    });

    await listAccount.execute({
      options: { page: 1, limit: 100 },
      entity: 'Account',
      exclude: false,
    });

    const cachedList = await listAccount.execute({
      options: { page: 1, limit: 100 },
      entity: 'Account',
      exclude: false,
    });

    await fakeAccountsRepository.create({
      code: 'Code',
      type: 'Investimento',
      task_type_id: taskType.id,
      tasks: [task],
      group_id: group.id,
    });

    const cached2List = await listAccount.execute({
      options: { page: 1, limit: 100 },
      entity: 'Account',
      exclude: false,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all accounts if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listAccount.execute({
      options: { page: 1, limit: 100 },
      entity: 'Account',
      exclude: false,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled accounts if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listAccount.execute({
      options: { page: 1, limit: 100 },
      entity: 'Account',
      exclude: true,
    });

    expect(pagination).toBeCalled();
  });
});
