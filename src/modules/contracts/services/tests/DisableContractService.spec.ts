import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DisableContractService from '../DisableContractService';

let fakeContractsRepository: FakeContractsRepository;
let fakeCacheProvider: FakeCacheProvider;
let disableContract: DisableContractService;

describe('DisableContract', () => {
  beforeEach(() => {
    fakeContractsRepository = new FakeContractsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    disableContract = new DisableContractService(
      fakeContractsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to disable a contract', async () => {
    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: true,
    });

    await disableContract.execute({
      contract_id: contract.id,
    });

    expect(contract.enabled).toBe(false);
  });
  it('should be not able to disable a non-exists contract', async () => {
    await expect(
      disableContract.execute({
        contract_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be not able to disable a contract if it is already disable', async () => {
    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
      enabled: false,
    });

    await expect(
      disableContract.execute({
        contract_id: contract.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
