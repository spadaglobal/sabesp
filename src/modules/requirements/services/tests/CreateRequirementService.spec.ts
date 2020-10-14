import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateRequirementService from '../CreateRequirementService';

let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeCacheProvider: FakeCacheProvider;

let createRequirement: CreateRequirementService;

describe('Create Requirement', () => {
  beforeEach(() => {
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createRequirement = new CreateRequirementService(
      fakeRequirementsRepository,
      fakeTaskTypesRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new requirement', async () => {
    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const requirementFather = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
      taskTypes: [taskType],
    });

    const requirement = await createRequirement.execute({
      title: 'Requirement Sub Title',
      parent_id: requirementFather.id,
    });

    expect(requirement).toHaveProperty('id');
  });
  it('should be able to create a new requirement without a task type', async () => {
    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const requirement = await createRequirement.execute({
      title: 'Requirement Sub Title',
      task_type_ids: [taskType.id],
    });

    expect(requirement).toHaveProperty('id');
  });
  it('should not be able to create a new requirement if the title was already used', async () => {
    const requirementFather = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    await expect(
      createRequirement.execute({
        title: 'Requirement Title',
        parent_id: requirementFather.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new requirement if the parent is invalid', async () => {
    await expect(
      createRequirement.execute({
        title: 'Requirement Title',
        parent_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new requirement if the task type is invalid', async () => {
    await expect(
      createRequirement.execute({
        title: 'Requirement Title',
        task_type_ids: ['invalid-id'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
