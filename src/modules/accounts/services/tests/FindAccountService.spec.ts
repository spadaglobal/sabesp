import FakeAccountsRepository from '@modules/accounts/repositories/fakes/FakeAccountsRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import AppError from '@shared/errors/AppError';

import FindAccountService from '../FindAccountService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeTasksRepository: FakeTasksRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let findAccount: FindAccountService;

describe('FindAccount', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeTasksRepository = new FakeTasksRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    findAccount = new FindAccountService(fakeAccountsRepository);
  });
  it('should be able to update the account', async () => {
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

    const account = await fakeAccountsRepository.create({
      code: 'Code',
      type: 'Investimento',
      task_type_id: taskType.id,
      tasks: [task],
      group_id: group.id,
    });

    const findedAccount = await findAccount.execute({
      account_id: account.id,
    });

    expect(findedAccount.id).toEqual(account.id);
  });
  it('should not be able to update a non-exists account', async () => {
    await expect(
      findAccount.execute({
        account_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
