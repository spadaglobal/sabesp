import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';

import AppError from '@shared/errors/AppError';

import FindContractService from '../FindContractService';

let fakeContractsRepository: FakeContractsRepository;
let findContract: FindContractService;

describe('FindContract', () => {
  beforeEach(() => {
    fakeContractsRepository = new FakeContractsRepository();
    findContract = new FindContractService(fakeContractsRepository);
  });
  it('should be able to update the contract', async () => {
    const contract = await fakeContractsRepository.create({
      title: 'Contract Title',
      description: 'Contract Description',
      objective: 'Contract Objective',
    });

    const findedContract = await findContract.execute({
      contract_id: contract.id,
    });

    expect(findedContract.id).toEqual(contract.id);
  });
  it('should not be able to update a non-exists contract', async () => {
    await expect(
      findContract.execute({
        contract_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
