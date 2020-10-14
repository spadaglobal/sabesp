import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateTaskTypeService from '../UpdateTaskTypeService';

let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateTaskType: UpdateTaskTypeService;

describe('UpdateTaskType', () => {
  beforeEach(() => {
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateTaskType = new UpdateTaskTypeService(
      fakeTaskTypesRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update a task type', async () => {
    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Description',
    });

    const newTaskType = await updateTaskType.execute({
      task_type_id: taskType.id,
      description: 'New Task Description',
    });

    expect(newTaskType.description).toBe('New Task Description');
  });
  it('should not be able to update a non-exists task type', async () => {
    await expect(
      updateTaskType.execute({
        task_type_id: 'non-exists-id',
        description: 'New Task Description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
