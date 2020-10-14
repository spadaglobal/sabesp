import FakeAccountsRepository from '@modules/accounts/repositories/fakes/FakeAccountsRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateAccountService from '../CreateAccountService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeTasksRepository: FakeTasksRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAccount: CreateAccountService;

describe('CreateAccount', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeTasksRepository = new FakeTasksRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    createAccount = new CreateAccountService(
      fakeAccountsRepository,
      fakeTasksRepository,
      fakeTaskTypesRepository,
      fakeGroupsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new account', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const account = await createAccount.execute({
      code: 'Code',
      type: 'Investimento',
      task_type_id: taskType.id,
      tasks_ids: [task.id],
      group_id: group.id,
    });

    expect(account).toHaveProperty('id');
  });
  it('should not be able to create a account if another has the same code', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    await createAccount.execute({
      code: 'Code',
      type: 'Investimento',
      task_type_id: taskType.id,
      tasks_ids: [task.id],
      group_id: group.id,
    });

    await expect(
      createAccount.execute({
        code: 'Code',
        type: 'Investimento',
        task_type_id: taskType.id,
        tasks_ids: [task.id],
        group_id: group.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an account with a non-exists task type', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    await expect(
      createAccount.execute({
        code: 'Code',
        type: 'Investimento',
        task_type_id: 'invalid-id',
        tasks_ids: [task.id],
        group_id: group.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an account with a non-exists group', async () => {
    const task = await fakeTasksRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    await expect(
      createAccount.execute({
        code: 'Code',
        type: 'Investimento',
        task_type_id: taskType.id,
        tasks_ids: [task.id],
        group_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an account with a non-exists tasks ids', async () => {
    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    await expect(
      createAccount.execute({
        code: 'Code',
        type: 'Investimento',
        task_type_id: taskType.id,
        tasks_ids: ['invalid-id'],
        group_id: group.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
