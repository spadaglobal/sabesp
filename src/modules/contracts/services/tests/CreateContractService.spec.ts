import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateContractService from '../CreateContractService';

let fakeContractsRepository: FakeContractsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createContract: CreateContractService;

describe('CreateContract', () => {
  beforeEach(() => {
    fakeContractsRepository = new FakeContractsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createContract = new CreateContractService(
      fakeContractsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new contract', async () => {
    const contract = await createContract.execute({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
    });

    expect(contract).toHaveProperty('id');
  });
  it('should not be able to create a contract if another has the same title', async () => {
    await createContract.execute({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
    });

    await expect(
      createContract.execute({
        title: 'Contract Title',
        description: 'Contract Description',
        objective: 'Contract Objective',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
