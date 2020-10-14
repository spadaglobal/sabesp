import AppError from '@shared/errors/AppError';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import FindUgrService from '../FindUgrService';

let fakeUgrsRepository: FakeUgrsRepository;
let updateUgr: FindUgrService;

describe('FindUgr', () => {
  beforeEach(() => {
    fakeUgrsRepository = new FakeUgrsRepository();
    updateUgr = new FindUgrService(fakeUgrsRepository);
  });
  it('should be able to return the ugr', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
    });

    const findedUgr = await updateUgr.execute({
      ugr_id: ugr.id,
    });

    expect(findedUgr.id).toBe(ugr.id);
  });
  it('should not be able to return a non-exists ugr', async () => {
    await expect(
      updateUgr.execute({
        ugr_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
