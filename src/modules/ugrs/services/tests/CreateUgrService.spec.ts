import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import CreateUgrService from '../CreateUgrService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createUgr: CreateUgrService;

describe('CreateUgr', () => {
  beforeEach(() => {
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createUgr = new CreateUgrService(fakeUgrsRepository, fakeCacheProvider);
  });
  it('should be able to create a new ugr', async () => {
    const ugr = await createUgr.execute({
      name: 'Ugr Title',
    });

    expect(ugr).toHaveProperty('id');
  });
});
