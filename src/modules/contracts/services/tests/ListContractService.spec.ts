import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListContractService from '../ListContractService';

let fakeContractsRepository: FakeContractsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listContract: ListContractService;

describe('ListContract', () => {
  beforeEach(() => {
    fakeContractsRepository = new FakeContractsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listContract = new ListContractService(
      fakeContractsRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: true,
    });

    await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: false,
    });

    const cachedList = await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: false,
    });

    await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: true,
    });

    const cached2List = await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: false,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all contracts if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: false,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled contracts if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: true,
    });

    expect(pagination).toBeCalled();
  });
});
