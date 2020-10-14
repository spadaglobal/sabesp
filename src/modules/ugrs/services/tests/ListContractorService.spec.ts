import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import ListContractorService from '../ListContractorService';

let fakeContractorsRepository: FakeContractorsRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listContractor: ListContractorService;

describe('ListContractor', () => {
  beforeEach(() => {
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listContractor = new ListContractorService(
      fakeContractorsRepository,
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

    await fakeContractorsRepository.create({
      contract_number: '36.334/12',
      name: 'Egis',
      prefix: 'EG',
      contract_id: contract.id,
      ugrs: [ugr],
    });

    await listContractor.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contractor',
      exclude: false,
    });

    const cachedList = await listContractor.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contractor',
      exclude: false,
    });

    await fakeContractorsRepository.create({
      contract_number: '32.434/12',
      name: 'Egis2',
      prefix: 'EG2',
      contract_id: contract.id,
      ugrs: [ugr],
    });

    const cached2List = await listContractor.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contractor',
      exclude: false,
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all contractors if exclude is equal to false', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listContractor.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contractor',
      exclude: false,
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all un-disabled contractors if exclude is equal to true', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listContractor.execute({
      options: { page: 1, limit: 100 },
      entity: 'Contractor',
      exclude: true,
    });

    expect(pagination).toBeCalled();
  });
});
