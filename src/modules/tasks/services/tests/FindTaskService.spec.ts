import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';

import AppError from '@shared/errors/AppError';

import FindTaskService from '../FindTaskService';

let fakeTasksRepository: FakeTasksRepository;
let findTask: FindTaskService;

describe('FindTask', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    findTask = new FindTaskService(fakeTasksRepository);
  });
  it('should be able to return a task', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const findedTask = await findTask.execute({
      task_id: task.id,
    });

    expect(findedTask.id).toEqual(task.id);
  });
  it('should not be able to return a non-exists task', async () => {
    await expect(
      findTask.execute({
        task_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
