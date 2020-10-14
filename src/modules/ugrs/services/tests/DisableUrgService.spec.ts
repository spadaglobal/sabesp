import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import DisableUgrService from '../DisableUgrService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let disableUgr: DisableUgrService;

describe('DisableUgr', () => {
  beforeEach(() => {
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    disableUgr = new DisableUgrService(fakeUgrsRepository, fakeCacheProvider);
  });
  it('should be able to disable a ugr', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    await disableUgr.execute({
      ugr_id: ugr.id,
    });

    expect(ugr.enabled).toBe(false);
  });
  it('should be not able to disable a non-exists ugr', async () => {
    await expect(
      disableUgr.execute({
        ugr_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be not able to disable a ugr if it is already disable', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: false,
    });

    await expect(
      disableUgr.execute({
        ugr_id: ugr.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
