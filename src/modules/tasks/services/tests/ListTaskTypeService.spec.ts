import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListTaskTypeService from '../ListTaskTypeService';

let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listTaskType: ListTaskTypeService;

describe('ListTaskType', () => {
  beforeEach(() => {
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listTaskType = new ListTaskTypeService(
      fakeTaskTypesRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    await listTaskType.execute({
      options: { page: 1, limit: 100 },
      entity: 'TaskType',
    });

    const cachedList = await listTaskType.execute({
      options: { page: 1, limit: 100 },
      entity: 'TaskType',
    });

    await fakeTaskTypesRepository.create({
      description: 'Task Type Description2',
    });

    const cached2List = await listTaskType.execute({
      options: { page: 1, limit: 100 },
      entity: 'TaskType',
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
});
