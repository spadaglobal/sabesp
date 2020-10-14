import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import AppError from '@shared/errors/AppError';

import FindTeamService from '../FindTeamService';

let fakeTeamsRepository: FakeTeamsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let findTeam: FindTeamService;

describe('FindTeam', () => {
  beforeEach(() => {
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    findTeam = new FindTeamService(fakeTeamsRepository);
  });
  it('should be able to return a team', async () => {
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

    const findedTeam = await findTeam.execute({
      team_id: team.id,
    });

    expect(findedTeam.id).toEqual(team.id);
  });
  it('should not be able to return a non-exists team', async () => {
    await expect(
      findTeam.execute({
        team_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
