import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateTeamService from '../UpdateTeamService';

let fakeTeamsRepository: FakeTeamsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateTeam: UpdateTeamService;

describe('UpdateTeam', () => {
  beforeEach(() => {
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateTeam = new UpdateTeamService(
      fakeTeamsRepository,
      fakeContractorsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update the team', async () => {
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

    const updatedTeam = await updateTeam.execute({
      team_id: team.id,
      name: 'New Team Title',
      contractor_id: contractor.id,
    });

    expect(updatedTeam.name).toBe('New Team Title');
  });
  it('should not be able to update a non-exists team', async () => {
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

    await expect(
      updateTeam.execute({
        team_id: 'non-exists-id',
        name: 'Team Title',
        contractor_id: contractor.id,
        enabled: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the enable property if it exists', async () => {
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

    const updatedTeam = await updateTeam.execute({
      team_id: team.id,
      name: 'New Team Title',
      contractor_id: contractor.id,
      enabled: false,
    });

    expect(updatedTeam.enabled).toBe(false);
  });
  it('should not be able to update a team if contractor not exists', async () => {
    const team = await fakeTeamsRepository.create({
      name: 'Team Title',
      contractor_id: 'non-exists-contractor',
      enabled: true,
    });

    await expect(
      updateTeam.execute({
        team_id: team.id,
        name: 'New Team Title',
        contractor_id: team.contractor_id,
        enabled: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
