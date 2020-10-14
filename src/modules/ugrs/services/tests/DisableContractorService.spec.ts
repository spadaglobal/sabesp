import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import AppError from '@shared/errors/AppError';
import DisableContractorService from '../DisableContractorService';

let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let disableContractor: DisableContractorService;

describe('DisableContractor', () => {
  beforeEach(() => {
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    disableContractor = new DisableContractorService(
      fakeContractorsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to disable the contractor', async () => {
    const contract = await fakeContractsRepository.create({
      title: '36.332/12',
      description: 'EGIS ENGENHARIA E CONSULTORIA LTDA',
      objective: 'SERVIÇO DE CONTROLE DE QUALIDADE E TECNOLOGIA',
      enabled: true,
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Itaquera',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_number: '34.332/20',
      name: 'Egis',
      prefix: 'EG',
      contract_id: contract.id,
      ugrs: [ugr],
      enabled: true,
    });

    await disableContractor.execute({
      contractor_id: contractor.id,
    });

    expect(contractor.enabled).toBe(false);
  });
  it('should not be able to disable a non-exists contractor', async () => {
    await expect(
      disableContractor.execute({
        contractor_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to disable a disabled contractor', async () => {
    const contract = await fakeContractsRepository.create({
      title: '36.332/12',
      description: 'EGIS ENGENHARIA E CONSULTORIA LTDA',
      objective: 'SERVIÇO DE CONTROLE DE QUALIDADE E TECNOLOGIA',
      enabled: true,
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Itaquera',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_number: '34.332/20',
      name: 'Egis',
      prefix: 'EG',
      contract_id: contract.id,
      ugrs: [ugr],
      enabled: false,
    });

    await expect(
      disableContractor.execute({
        contractor_id: contractor.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
