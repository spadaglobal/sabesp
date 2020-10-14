import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DisableTeamService from '../DisableTeamService';

let fakeTeamsRepository: FakeTeamsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let disableTeam: DisableTeamService;

describe('DisableTeam', () => {
  beforeEach(() => {
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    disableTeam = new DisableTeamService(
      fakeTeamsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to disable a team', async () => {
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

    const team = await fakeTeamsRepository.create({
      name: 'Team Title',
      contractor_id: contractor.id,
      enabled: true,
    });

    await disableTeam.execute({
      team_id: team.id,
    });

    expect(team.enabled).toBe(false);
  });
  it('should be not able to disable a non-exists team', async () => {
    await expect(
      disableTeam.execute({
        team_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be not able to disable a team if it is already disable', async () => {
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

    const team = await fakeTeamsRepository.create({
      name: 'Team Title',
      contractor_id: contractor.id,
      enabled: false,
    });

    await expect(
      disableTeam.execute({
        team_id: team.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
