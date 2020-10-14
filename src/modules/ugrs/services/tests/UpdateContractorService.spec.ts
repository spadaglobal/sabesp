import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import AppError from '@shared/errors/AppError';
import UpdateContractorService from '../UpdateContractorService';

let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateContractor: UpdateContractorService;

describe('UpdateContractor', () => {
  beforeEach(() => {
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateContractor = new UpdateContractorService(
      fakeContractorsRepository,
      fakeContractsRepository,
      fakeUgrsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update the contractor', async () => {
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

    const contractorUpdated = await updateContractor.execute({
      contractor_id: contractor.id,
      contract_number: '36.334/20',
      name: 'Egis',
      prefix: 'EG',
      contract_id: contract.id,
      ugr_ids: [ugr.id],
      enabled: true,
    });

    expect(contractorUpdated.contract_number).toBe('36.334/20');
  });
  it('should not be able to update a non-exists contractor', async () => {
    const contract = await fakeContractsRepository.create({
      title: '36.332/12',
      description: 'EGIS ENGENHARIA E CONSULTORIA LTDA',
      objective: 'SERVIÇO DE CONTROLE DE QUALIDADE E TECNOLOGIA',
      enabled: true,
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Itaquera',
    });

    await expect(
      updateContractor.execute({
        contractor_id: 'non-exists-id',
        contract_number: '36.334/20',
        name: 'Egis',
        prefix: 'EG',
        contract_id: contract.id,
        ugr_ids: [ugr.id],
        enabled: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a contractor with a non-exists contract_id', async () => {
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
    });

    await expect(
      updateContractor.execute({
        contractor_id: contractor.id,
        contract_number: contractor.contract_number,
        name: contractor.name,
        prefix: contractor.prefix,
        contract_id: 'non-exists-id',
        ugr_ids: [ugr.id],
        enabled: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a contractor with a non-exists ugr_id', async () => {
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
    });

    await expect(
      updateContractor.execute({
        contractor_id: contractor.id,
        contract_number: contractor.contract_number,
        name: contractor.name,
        prefix: contractor.prefix,
        ugr_ids: ['non-exists-id'],
        enabled: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
