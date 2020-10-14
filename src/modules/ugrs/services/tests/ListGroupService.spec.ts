import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import ListGroupService from '../ListGroupService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listGroup: ListGroupService;

describe('ListGroup', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listGroup = new ListGroupService(
      fakeGroupsRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    await fakeGroupsRepository.create({
      name: 'Group Title',
      ugr_id: ugr.id,
    });

    await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: false,
    });

    const cachedList = await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: false,
    });

    await fakeGroupsRepository.create({
      name: 'Group Title2',
      ugr_id: ugr.id,
    });

    const cached2List = await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: false,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all groups if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: false,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled groups if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: true,
    });

    expect(pagination).toBeCalled();
  });
});
