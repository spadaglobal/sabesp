import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeLvsRepository from '@modules/lvs/repositories/fakes/FakeLvsRepository';
import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

import FindLvService from '../FindLvService';

let fakeLvsRepository: FakeLvsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeTaskRepository: FakeTasksRepository;
let fakeTeamsRepository: FakeTeamsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let updateLv: FindLvService;

describe('FindLv', () => {
  beforeEach(() => {
    fakeLvsRepository = new FakeLvsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeTaskRepository = new FakeTasksRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    updateLv = new FindLvService(fakeLvsRepository);
  });
  it('should be able to return a lv', async () => {
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço Executado',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const lv = await fakeLvsRepository.create({
      contract_id: contract.id,
      date_start: new Date(),
      date_end: new Date(),
      time_start: new Date(),
      time_end: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      task_type_id: taskType.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      team_id: team.id,
      order_id: order.id,
      contractor_id: contractor.id,
      status: 'open',
      user_id: user.id,
    });

    const lvFind = await updateLv.execute({
      lv_id: lv.id,
    });

    expect(lvFind.id).toEqual(lv.id);
  });
  it('should not be able to return a non-exists lv', async () => {
    await expect(
      updateLv.execute({
        lv_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
