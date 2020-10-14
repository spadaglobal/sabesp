import FakeReasonsRepository from '@modules/reasons/repositories/fakes/FakeReasonsRepository';
import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListReasonService from '../ListReasonService';

let fakeReasonsRepository: FakeReasonsRepository;
let fakeRequirementsRepository: FakeRequirementsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listReason: ListReasonService;

describe('ListReason', () => {
  beforeEach(() => {
    fakeReasonsRepository = new FakeReasonsRepository();
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listReason = new ListReasonService(
      fakeReasonsRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });
    await fakeReasonsRepository.create({
      description: 'Reason Description',
      requirement_id: requirement.id,
    });

    await listReason.execute({
      options: { page: 1, limit: 100 },
      entity: 'Reason',
      requirement_id: requirement.id,
    });

    const cachedList = await listReason.execute({
      options: { page: 1, limit: 100 },
      entity: 'Reason',
      requirement_id: requirement.id,
    });

    await fakeReasonsRepository.create({
      description: 'Reason Description2',
      requirement_id: requirement.id,
    });

    const cached2List = await listReason.execute({
      options: { page: 1, limit: 100 },
      entity: 'Reason',
      requirement_id: requirement.id,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
});
