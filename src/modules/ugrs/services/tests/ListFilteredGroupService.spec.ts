import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import ListFilteredGroupService from '../ListFilteredGroupService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakePaginationProvider: FakePaginationProvider;
let listGroup: ListFilteredGroupService;

describe('ListFilteredGroupService', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    listGroup = new ListFilteredGroupService(
      fakeGroupsRepository,
      fakePaginationProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      ugr_id: ugr.id,
    });

    await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: false,
      name: group.name,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all groups if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      ugr_id: ugr.id,
    });

    await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: false,
      name: group.name,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled groups if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      ugr_id: ugr.id,
      enabled: true,
    });

    await listGroup.execute({
      options: { page: 1, limit: 100 },
      entity: 'Group',
      exclude: true,
      name: group.name,
    });

    expect(pagination).toBeCalled();
  });
});
