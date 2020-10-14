import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';

import AppError from '@shared/errors/AppError';

import FindTaskTypeService from '../FindTaskTypeService';

let fakeTaskTypesRepository: FakeTaskTypesRepository;
let updateTaskType: FindTaskTypeService;

describe('FindTaskType', () => {
  beforeEach(() => {
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    updateTaskType = new FindTaskTypeService(fakeTaskTypesRepository);
  });
  it('should be able to return a task type', async () => {
    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Description',
    });

    const findedTaskType = await updateTaskType.execute({
      task_type_id: taskType.id,
    });

    expect(findedTaskType.id).toEqual(taskType.id);
  });
  it('should not be able to return a non-exists task type', async () => {
    await expect(
      updateTaskType.execute({
        task_type_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
