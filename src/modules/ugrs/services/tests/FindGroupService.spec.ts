import AppError from '@shared/errors/AppError';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import FindGroupService from '../FindGroupService';

let fakeUgrsRepository: FakeUgrsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let findGroup: FindGroupService;

describe('FindGroup', () => {
  beforeEach(() => {
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    findGroup = new FindGroupService(fakeGroupsRepository);
  });
  it('should be able to update the group', async () => {
    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Name',
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Title',
      ugr_id: ugr.id,
    });

    const findedGroup = await findGroup.execute({
      group_id: group.id,
    });

    expect(findedGroup.id).toEqual(group.id);
  });
  it('should not be able to return a non-exists group', async () => {
    await expect(
      findGroup.execute({
        group_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
