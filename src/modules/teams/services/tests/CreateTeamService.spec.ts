import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateTeamService from '../CreateTeamService';

let fakeTeamsRepository: FakeTeamsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createTeam: CreateTeamService;

describe('CreateTeam', () => {
  beforeEach(() => {
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createTeam = new CreateTeamService(
      fakeTeamsRepository,
      fakeContractorsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new team', async () => {
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
      contract_number: '36.334/12',
      name: 'Egis',
      prefix: 'EG',
      contract_id: contract.id,
      ugrs: [ugr],
    });

    const team = await createTeam.execute({
      name: 'Team Title',
      contractor_id: contractor.id,
      enabled: true,
    });

    expect(team).toHaveProperty('id');
  });
  it('should not be able to create a team if contractor not exists', async () => {
    await expect(
      createTeam.execute({
        name: 'Team Title',
        contractor_id: 'non-exists-id',
        enabled: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
