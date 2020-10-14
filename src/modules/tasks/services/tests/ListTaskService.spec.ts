import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListTaskService from '../ListTaskService';

let fakeTasksRepository: FakeTasksRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listTask: ListTaskService;

describe('ListTask', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listTask = new ListTaskService(
      fakeTasksRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: false,
    });

    const cachedList = await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: false,
    });

    await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const cached2List = await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: false,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all tasks', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: false,
    });

    expect(pagination).toBeCalled();
  });

  it('should be able to get non-disabled tasks', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: true,
    });

    expect(pagination).toBeCalled();
  });
});
