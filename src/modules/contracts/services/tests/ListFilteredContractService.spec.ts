import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';

import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListFilteredContractService from '../ListFilteredContractService';

let fakeContractsRepository: FakeContractsRepository;
let fakePaginationProvider: FakePaginationProvider;
let listContract: ListFilteredContractService;

describe('ListFilteredContract', () => {
  beforeEach(() => {
    fakeContractsRepository = new FakeContractsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    listContract = new ListFilteredContractService(
      fakeContractsRepository,
      fakePaginationProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: true,
    });

    await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: false,
      name: contract.title,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all contracts if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: true,
    });

    await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: false,
      name: contract.title,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled contracts if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: false,
    });

    await listContract.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contract',
      exclude: true,
      name: contract.title,
    });

    expect(pagination).toBeCalled();
  });
});
