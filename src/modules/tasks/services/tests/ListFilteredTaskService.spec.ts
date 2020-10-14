import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';

import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListFilteredTaskService from '../ListFilteredTaskService';

let fakeTasksRepository: FakeTasksRepository;
let fakePaginationProvider: FakePaginationProvider;
let listTask: ListFilteredTaskService;

describe('ListFilteredTaskService', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository();
    fakePaginationProvider = new FakePaginationProvider();
    listTask = new ListFilteredTaskService(
      fakeTasksRepository,
      fakePaginationProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: false,
      name: task.description,
      type: '',
    });

    expect(pagination).toBeCalled();
  });
  it('should be able to get all tasks', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: false,
      name: task.description,
      type: '',
    });

    expect(pagination).toBeCalled();
  });

  it('should be able to get non-disabled tasks', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: false,
      type: 'Serviço Executado',
    });

    await listTask.execute({
      options: { page: 1, limit: 100 },
      entity: 'Task',
      exclude: true,
      name: task.description,
      type: '',
    });

    expect(pagination).toBeCalled();
  });
});
