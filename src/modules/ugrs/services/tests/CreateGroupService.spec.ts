import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import AppError from '@shared/errors/AppError';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import CreateGroupService from '../CreateGroupService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createGroup: CreateGroupService;

describe('CreateGroup', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createGroup = new CreateGroupService(
      fakeUgrsRepository,
      fakeGroupsRepository,
      fakeCacheProvider,
    );
  });
  it('should not be able to create a new group with a non-exists ugr', async () => {
    await expect(
      createGroup.execute({
        name: 'Group Title',
        ugr_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to create a new group', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'New Ugr',
    });

    const group = await createGroup.execute({
      name: 'Group Title',
      ugr_id: ugr.id,
    });

    expect(group).toHaveProperty('id');
  });
});
