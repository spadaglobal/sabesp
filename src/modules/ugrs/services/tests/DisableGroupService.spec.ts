import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import DisableGroupService from '../DisableGroupService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeCacheProvider: FakeCacheProvider;
let disableGroup: DisableGroupService;

describe('DisableGroup', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeUgrsRepository = new FakeUgrsRepository();
    disableGroup = new DisableGroupService(
      fakeGroupsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to disable a group', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      enabled: true,
      ugr_id: ugr.id,
    });

    await disableGroup.execute({
      group_id: group.id,
    });

    expect(group.enabled).toBe(false);
  });
  it('should be not able to disable a non-exists group', async () => {
    await expect(
      disableGroup.execute({
        group_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be not able to disable a group if it is already disable', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      ugr_id: ugr.id,
      enabled: false,
    });

    await expect(
      disableGroup.execute({
        group_id: group.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
