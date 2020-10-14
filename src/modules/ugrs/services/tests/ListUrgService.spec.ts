import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import ListUgrService from '../ListUgrService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listUgr: ListUgrService;

describe('ListUgr', () => {
  beforeEach(() => {
    fakeUgrsRepository = new FakeUgrsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listUgr = new ListUgrService(
      fakeUgrsRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    await fakeUgrsRepository.create({
      name: 'Ugr Title',
    });

    await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: false,
    });

    const cachedList = await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: false,
    });

    await fakeUgrsRepository.create({
      name: 'Ugr Title2',
    });

    const cached2List = await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: false,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all ugrs if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: false,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled ugrs if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: true,
    });

    expect(pagination).toBeCalled();
  });
});
