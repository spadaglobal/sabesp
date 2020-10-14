import Task from '@modules/tasks/infra/typeorm/entities/Task';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';
import ITaskTypesRepository from '@modules/tasks/repositories/ITaskTypesRepository';
import IGroupsRepository from '@modules/ugrs/repositories/IGroupsRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Account from '../infra/typeorm/entities/Account';
import IAccountsRepository from '../repositories/IAccountsRepository';

interface IRequest {
  type: string;
  task_type_id: string;
  code: string;
  tasks_ids: string[];
  group_id: string;
}

@injectable()
class CreateAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    type,
    task_type_id,
    code,
    tasks_ids,
    group_id,
  }: IRequest): Promise<Account> {
    const checkAccountExists = await this.accountsRepository.findByCode(code);

    if (checkAccountExists) {
      throw new AppError('A account is already using this code');
    }

    const checkTaskTypeExists = await this.taskTypesRepository.findById(
      task_type_id,
    );
    if (!checkTaskTypeExists) {
      throw new AppError('Task type not found');
    }

    const checkGroupExists = await this.groupsRepository.findById(group_id);
    if (!checkGroupExists) {
      throw new AppError('Group not found');
    }

    const tasks: Task[] = [];

    await Promise.all(
      tasks_ids.map(async task_id => {
        const checkTaskExists = await this.tasksRepository.findById(task_id);

        if (!checkTaskExists) {
          throw new AppError('This task not exists');
        }
        tasks.push(checkTaskExists);
      }),
    );

    const account = await this.accountsRepository.create({
      code,
      task_type_id,
      type,
      group_id,
      tasks,
    });

    await this.cacheProvider.invalidatePrefix('accounts-list');

    return account;
  }
}

export default CreateAccountService;
