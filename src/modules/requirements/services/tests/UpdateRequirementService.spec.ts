import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateRequirementService from '../UpdateRequirementService';

let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateRequirement: UpdateRequirementService;

describe('Update Requirement', () => {
  beforeEach(() => {
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateRequirement = new UpdateRequirementService(
      fakeRequirementsRepository,
      fakeTaskTypesRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update a requirement', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title Father',
    });

    const requirementChild = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const updatedRequirement = await updateRequirement.execute({
      requirement_id: requirementChild.id,
      title: 'Requirement Title',
      parent_id: requirement.id,
    });

    expect(updatedRequirement.parent_id).toEqual(requirement.id);
  });
  it('should be able to update a requirement without parent', async () => {
    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
      taskTypes: [taskType],
    });

    const updatedRequirement = await updateRequirement.execute({
      requirement_id: requirement.id,
      task_type_ids: [taskType.id],
      type: 'Ambos',
      title: 'New Requirement Title',
    });

    expect(updatedRequirement.title).toBe('New Requirement Title');
  });
  it('should not be able to update a non-exists requirement', async () => {
    await expect(
      updateRequirement.execute({
        requirement_id: 'invalid-id',
        title: 'New Requirement Title',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a requirement if the title was already used', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title 2',
    });

    await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    await expect(
      updateRequirement.execute({
        requirement_id: requirement.id,
        title: 'Requirement Title',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a requirement if the parent is invalid', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title 2',
    });

    await expect(
      updateRequirement.execute({
        requirement_id: requirement.id,
        title: 'Requirement Title',
        parent_id: 'invalid_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a requirement if the task type is invalid', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title 2',
    });

    await expect(
      updateRequirement.execute({
        requirement_id: requirement.id,
        title: 'Requirement Title',
        task_type_ids: ['invalid-id'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
