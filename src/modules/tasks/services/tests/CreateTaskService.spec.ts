import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateTaskService from '../CreateTaskService';

let fakeTasksRepository: FakeTasksRepository;
let fakeCacheProvider: FakeCacheProvider;

let createTask: CreateTaskService;

describe('CreateTask', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createTask = new CreateTaskService(fakeTasksRepository, fakeCacheProvider);
  });
  it('should be able to create a new task', async () => {
    const task = await createTask.execute({
      description: 'Task Description',
      type: 'Serviço Executado',
      enabled: true,
    });

    expect(task).toHaveProperty('id');
  });
});
