import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import AppError from '@shared/errors/AppError';
import CreateContractorService from '../CreateContractorService';

let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createContractor: CreateContractorService;

describe('CreateContractor', () => {
  beforeEach(() => {
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createContractor = new CreateContractorService(
      fakeContractorsRepository,
      fakeContractsRepository,
      fakeUgrsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new contractor', async () => {
    const contract = await fakeContractsRepository.create({
      title: '36.332/12',
      description: 'EGIS ENGENHARIA E CONSULTORIA LTDA',
      objective: 'SERVIÇO DE CONTROLE DE QUALIDADE E TECNOLOGIA',
      enabled: true,
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Itaquera',
    });

    const contractor = await createContractor.execute({
      contract_number: '36.334/12',
      name: 'Egis',
      prefix: 'EG',
      contract_id: contract.id,
      ugr_ids: [ugr.id],
    });

    expect(contractor).toHaveProperty('id');
  });
  it('should not be able to create a new contractor if contract number is already in use', async () => {
    const contract = await fakeContractsRepository.create({
      title: '36.332/12',
      description: 'EGIS ENGENHARIA E CONSULTORIA LTDA',
      objective: 'SERVIÇO DE CONTROLE DE QUALIDADE E TECNOLOGIA',
      enabled: true,
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Itaquera',
    });

    await createContractor.execute({
      contract_number: '36.334/12',
      name: 'Egis',
      prefix: 'EG',
      contract_id: contract.id,
      ugr_ids: [ugr.id],
    });

    await expect(
      createContractor.execute({
        contract_number: '36.334/12',
        name: 'Egis',
        prefix: 'EG',
        contract_id: contract.id,
        ugr_ids: [ugr.id],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new contractor if the contract_id not belongs to a contract', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Itaquera',
    });

    await expect(
      createContractor.execute({
        contract_number: '36.334/12',
        name: 'Egis',
        prefix: 'EG',
        contract_id: 'non-exists-id',
        ugr_ids: [ugr.id],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new contractor if the ugr_id not belongs to a ugr', async () => {
    const contract = await fakeContractsRepository.create({
      title: '36.332/12',
      description: 'EGIS ENGENHARIA E CONSULTORIA LTDA',
      objective: 'SERVIÇO DE CONTROLE DE QUALIDADE E TECNOLOGIA',
      enabled: true,
    });

    await expect(
      createContractor.execute({
        contract_number: '36.334/12',
        name: 'Egis',
        prefix: 'EG',
        contract_id: contract.id,
        ugr_ids: ['non-exists-id'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
