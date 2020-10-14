import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListTeamService from '../ListTeamService';

let fakeTeamsRepository: FakeTeamsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listTeam: ListTeamService;

describe('ListTeam', () => {
  beforeEach(() => {
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listTeam = new ListTeamService(
      fakeTeamsRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

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

    await fakeTeamsRepository.create({
      name: 'Team Title',
      contractor_id: contractor.id,
      enabled: true,
    });

    await listTeam.execute({
      options: { page: 1, limit: 100 },
      entity: 'Team',
      exclude: false,
    });

    const cachedList = await listTeam.execute({
      options: { page: 1, limit: 100 },
      entity: 'Team',
      exclude: false,
    });

    await fakeTeamsRepository.create({
      name: 'Team Title 2',
      contractor_id: contractor.id,
      enabled: true,
    });

    const cached2List = await listTeam.execute({
      options: { page: 1, limit: 100 },
      entity: 'Team',
      exclude: false,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all teams if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listTeam.execute({
      options: { page: 1, limit: 100 },
      entity: 'Team',
      exclude: false,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled teams if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listTeam.execute({
      options: { page: 1, limit: 100 },
      entity: 'Team',
      exclude: true,
    });

    expect(pagination).toBeCalled();
  });
});
