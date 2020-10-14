import '@modules/users/providers';
import './providers';

import AccountsRepository from '@modules/accounts/infra/typeorm/repositories/AccountsRepository';
import IAccountsRepository from '@modules/accounts/repositories/IAccountsRepository';
import ContractsRepository from '@modules/contracts/infra/typeorm/repositories/ContractsRepository';
import IContractsRepository from '@modules/contracts/repositories/IContractsRepository';
import LvPosRepository from '@modules/lvPos/infra/typeorm/repositories/LvPosRepository';
import ILvPosRepository from '@modules/lvPos/repositories/ILvPosRepository';
import LvsRepository from '@modules/lvs/infra/typeorm/repositories/LvsRepository';
import ILvsRepository from '@modules/lvs/repositories/ILvsRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ReasonsRepository from '@modules/reasons/infra/typeorm/repositories/ReasonsRepository';
import IReasonsRepository from '@modules/reasons/repositories/IReasonsRepository';
import RequirementsRepository from '@modules/requirements/infra/typeorm/repositories/RequirementsRepository';
import IRequirementsRepository from '@modules/requirements/repositories/IRequirementsRepository';
import ReviewsRepository from '@modules/reviews/infra/typeorm/repositories/ReviewsRepository';
import ReviewsRequirementsRepository from '@modules/reviews/infra/typeorm/repositories/ReviewsRequirementsRepository';
import IReviewsRepository from '@modules/reviews/repositories/IReviewsRepository';
import IReviewsRequirementsRepository from '@modules/reviews/repositories/IReviewsRequirementsRepository';
import TasksRepository from '@modules/tasks/infra/typeorm/repositories/TasksRepository';
import TaskTypesRepository from '@modules/tasks/infra/typeorm/repositories/TaskTypesRepository';
import ITasksRepository from '@modules/tasks/repositories/ITasksRepository';
import ITaskTypesRepository from '@modules/tasks/repositories/ITaskTypesRepository';
import TeamsRepository from '@modules/teams/infra/typeorm/repositories/TeamsRepository';
import ITeamsRepository from '@modules/teams/repositories/ITeamsRepository';
import ContractorsRepository from '@modules/ugrs/infra/typeorm/repositories/ContractorsRepository';
import GroupsRepository from '@modules/ugrs/infra/typeorm/repositories/GroupsRepository';
import UgrsRepository from '@modules/ugrs/infra/typeorm/repositories/UgrsRepository';
import IContractorsRepository from '@modules/ugrs/repositories/IContactorsRepository';
import IGroupsRepository from '@modules/ugrs/repositories/IGroupsRepository';
import IUgrsRepository from '@modules/ugrs/repositories/IUgrsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { container } from 'tsyringe';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IContractsRepository>(
  'ContractsRepository',
  ContractsRepository,
);

container.registerSingleton<ITasksRepository>(
  'TasksRepository',
  TasksRepository,
);

container.registerSingleton<ITaskTypesRepository>(
  'TaskTypesRepository',
  TaskTypesRepository,
);

container.registerSingleton<IUgrsRepository>('UgrsRepository', UgrsRepository);

container.registerSingleton<IGroupsRepository>(
  'GroupsRepository',
  GroupsRepository,
);

container.registerSingleton<IContractorsRepository>(
  'ContractorsRepository',
  ContractorsRepository,
);

container.registerSingleton<ITeamsRepository>(
  'TeamsRepository',
  TeamsRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<ILvsRepository>('LvsRepository', LvsRepository);

container.registerSingleton<ILvPosRepository>(
  'LvPosRepository',
  LvPosRepository,
);

container.registerSingleton<IAccountsRepository>(
  'AccountsRepository',
  AccountsRepository,
);

container.registerSingleton<IRequirementsRepository>(
  'RequirementsRepository',
  RequirementsRepository,
);

container.registerSingleton<IReasonsRepository>(
  'ReasonsRepository',
  ReasonsRepository,
);

container.registerSingleton<IReviewsRepository>(
  'ReviewsRepository',
  ReviewsRepository,
);

container.registerSingleton<IReviewsRequirementsRepository>(
  'ReviewsRequirementsRepository',
  ReviewsRequirementsRepository,
);
