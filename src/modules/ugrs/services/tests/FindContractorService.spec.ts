import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import AppError from '@shared/errors/AppError';
import FindContractorService from '../FindContractorService';

let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let findContractor: FindContractorService;

describe('FindContractor', () => {
  beforeEach(() => {
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    findContractor = new FindContractorService(fakeContractorsRepository);
  });
  it('should be able to return a contractor', async () => {
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

    const contractorFinded = await findContractor.execute({
      contractor_id: contractor.id,
    });

    expect(contractorFinded.id).toEqual(contractor.id);
  });
  it('should not be able to return a non-exists contractor', async () => {
    await expect(
      findContractor.execute({
        contractor_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
