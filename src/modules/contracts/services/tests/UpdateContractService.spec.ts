import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateContractService from '../UpdateContractService';

let fakeContractsRepository: FakeContractsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateContract: UpdateContractService;

describe('UpdateContract', () => {
  beforeEach(() => {
    fakeContractsRepository = new FakeContractsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateContract = new UpdateContractService(
      fakeContractsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update the contract', async () => {
    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
    });

    const updatedContract = await updateContract.execute({
      contract_id: contract.id,
      title: contract.title,
      description: 'Contract Description Updated',
      objective: contract.objective,
    });

    expect(updatedContract.description).toBe('Contract Description Updated');
  });
  it('should not be able to update a non-exists contract', async () => {
    await expect(
      updateContract.execute({
        contract_id: 'non-exists-id',
        title: 'Contract Title',
        description: 'Contract Description',
        objective: 'Contract Objective',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the enable property if it exists', async () => {
    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: true,
    });

    const updatedContract = await updateContract.execute({
      contract_id: contract.id,
      title: contract.title,
      description: contract.description,
      objective: contract.objective,
      enabled: false,
    });

    expect(updatedContract.enabled).toBe(false);
  });
});
