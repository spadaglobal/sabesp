import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import UpdateUgrService from '../UpdateUgrService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateUgr: UpdateUgrService;

describe('UpdateUgr', () => {
  beforeEach(() => {
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateUgr = new UpdateUgrService(fakeUgrsRepository, fakeCacheProvider);
  });
  it('should be able to update the ugr', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
    });

    const updatedUgr = await updateUgr.execute({
      ugr_id: ugr.id,
      name: 'Ugr Title Updated',
    });

    expect(updatedUgr.name).toBe('Ugr Title Updated');
  });
  it('should not be able to update a non-exists ugr', async () => {
    await expect(
      updateUgr.execute({
        ugr_id: 'non-exists-id',
        name: 'Ugr Title',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the enable property if it exists', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const updatedUgr = await updateUgr.execute({
      ugr_id: ugr.id,
      name: ugr.name,
      enabled: false,
    });

    expect(updatedUgr.enabled).toBe(false);
  });
});
