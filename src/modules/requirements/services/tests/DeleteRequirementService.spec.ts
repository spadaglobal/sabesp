import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DeleteRequirementService from '../DeleteRequirementService';

let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeCacheProvider: FakeCacheProvider;

let deleteRequirement: DeleteRequirementService;

describe('Delete Requirement', () => {
  beforeEach(() => {
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteRequirement = new DeleteRequirementService(
      fakeRequirementsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to disable a requirement', async () => {
    const remove = jest.spyOn(fakeRequirementsRepository, 'remove');

    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    await deleteRequirement.execute({
      requirement_id: requirement.id,
    });

    expect(remove).toBeCalledWith(requirement);
  });
  it('should not be able to delete a non-exists requirement', async () => {
    await expect(
      deleteRequirement.execute({
        requirement_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
