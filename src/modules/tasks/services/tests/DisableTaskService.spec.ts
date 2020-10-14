import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DisableTaskService from '../DisableTaskService';

let fakeTasksRepository: FakeTasksRepository;
let fakeCacheProvider: FakeCacheProvider;

let disableTask: DisableTaskService;

describe('DisableTask', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    fakeCacheProvider = new FakeCacheProvider();
    disableTask = new DisableTaskService(
      fakeTasksRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to disable a task', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    await disableTask.execute({
      task_id: task.id,
    });

    expect(task.enabled).toBe(false);
  });
  it('should not be able to disable a non-exists task', async () => {
    await expect(
      disableTask.execute({
        task_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to disable a disabled task', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: false,
      type: 'Serviço Executado',
    });

    await expect(
      disableTask.execute({
        task_id: task.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
