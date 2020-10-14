import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DeleteTaskTypeService from '../DeleteTaskTypeService';

let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteTaskType: DeleteTaskTypeService;

describe('DeleteTaskType', () => {
  beforeEach(() => {
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteTaskType = new DeleteTaskTypeService(
      fakeTaskTypesRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to delete a task type', async () => {
    const remove = jest.spyOn(fakeTaskTypesRepository, 'remove');

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    await deleteTaskType.execute({
      task_type_id: taskType.id,
    });

    expect(remove).toBeCalledWith(taskType.id);
  });
  it('should not be able to delte a non-exists task type', async () => {
    await expect(
      deleteTaskType.execute({
        task_type_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
