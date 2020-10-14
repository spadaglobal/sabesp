import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateTaskService from '../UpdateTaskService';

let fakeTasksRepository: FakeTasksRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateTask: UpdateTaskService;

describe('UpdateTask', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateTask = new UpdateTaskService(fakeTasksRepository, fakeCacheProvider);
  });
  it('should be able to update a task', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    await updateTask.execute({
      task_id: task.id,
      description: 'New Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    expect(task.description).toBe('New Task Description');
  });
  it('should not be able to update a non-exists task', async () => {
    await expect(
      updateTask.execute({
        task_id: 'non-exists-id',
        description: 'New Task Description',
        enabled: true,
        type: 'Serviço Executado',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
