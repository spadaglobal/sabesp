import FakeAccountsRepository from '@modules/accounts/repositories/fakes/FakeAccountsRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DeleteAccountService from '../DeleteAccountService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeTasksRepository: FakeTasksRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeCacheProvider: FakeCacheProvider;
let disableAccount: DeleteAccountService;

describe('Delete Account', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeTasksRepository = new FakeTasksRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    disableAccount = new DeleteAccountService(
      fakeAccountsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to delete an account', async () => {
    const remove = jest.spyOn(fakeAccountsRepository, 'remove');

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

    await disableAccount.execute({
      account_id: account.id,
    });

    expect(remove).toBeCalledWith(account);
  });
  it('should be not able to delete a non-exists account', async () => {
    await expect(
      disableAccount.execute({
        account_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
