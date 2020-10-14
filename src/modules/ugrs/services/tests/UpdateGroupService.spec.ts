import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import UpdateGroupService from '../UpdateGroupService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateGroup: UpdateGroupService;

describe('UpdateGroup', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateGroup = new UpdateGroupService(
      fakeUgrsRepository,
      fakeGroupsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update the group', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      ugr_id: ugr.id,
    });

    const updatedGroup = await updateGroup.execute({
      group_id: group.id,
      name: 'Group Title Updated',
    });

    expect(updatedGroup.name).toBe('Group Title Updated');
  });
  it('should not be able to update a non-exists group', async () => {
    await expect(
      updateGroup.execute({
        group_id: 'non-exists-id',
        name: 'Group Title',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the enable property if it exists', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      enabled: true,
      ugr_id: ugr.id,
    });

    const updatedGroup = await updateGroup.execute({
      group_id: group.id,
      name: group.name,
      enabled: false,
    });

    expect(updatedGroup.enabled).toBe(false);
  });
  it('should be able to update the ugr_id property if it exists', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      enabled: true,
      ugr_id: ugr.id,
    });

    const updatedGroup = await updateGroup.execute({
      group_id: group.id,
      name: group.name,
      enabled: false,
      ugr_id: ugr.id,
    });

    expect(updatedGroup.ugr_id).toBe(ugr.id);
  });
  it('should not be able to update a group if ugr not exists', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      enabled: true,
      ugr_id: ugr.id,
    });

    await expect(
      updateGroup.execute({
        group_id: group.id,
        name: group.name,
        enabled: false,
        ugr_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
