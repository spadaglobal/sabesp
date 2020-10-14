import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateTaskTypeService from '../CreateTaskTypeService';

let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeCacheProvider: FakeCacheProvider;
let createTaskType: CreateTaskTypeService;

describe('CreateTaskType', () => {
  beforeEach(() => {
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createTaskType = new CreateTaskTypeService(
      fakeTaskTypesRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new task type', async () => {
    const taskType = await createTaskType.execute({
      description: 'Task Type Description',
    });

    expect(taskType).toHaveProperty('id');
  });
});
