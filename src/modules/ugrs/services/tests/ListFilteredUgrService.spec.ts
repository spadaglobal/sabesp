import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import ListFilteredUgrService from '../ListFilteredUgrService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakePaginationProvider: FakePaginationProvider;
let listUgr: ListFilteredUgrService;

describe('ListFilteredUgr', () => {
  beforeEach(() => {
    fakeUgrsRepository = new FakeUgrsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    listUgr = new ListFilteredUgrService(
      fakeUgrsRepository,
      fakePaginationProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    const ugr1 = await fakeUgrsRepository.create({
      name: 'Ugr Title',
    });

    await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: false,
      name: ugr1.name,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all ugrs if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const ugr1 = await fakeUgrsRepository.create({
      name: 'Ugr Title',
    });

    await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: false,
      name: ugr1.name,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled ugrs if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const ugr1 = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: false,
    });

    await listUgr.execute({
      options: { page: 1, limit: 100 },
      entity: 'Ugr',
      exclude: true,
      name: ugr1.name,
    });

    expect(pagination).toBeCalled();
  });
});
