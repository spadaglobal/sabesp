import FakeContractsRepository from '@modules/contracts/repositories/fakes/FakeContractsRepository';
import FakeLvPosRepository from '@modules/lvPos/repositories/fakes/FakeLvPosRepository';
import FakeLvsRepository from '@modules/lvs/repositories/fakes/FakeLvsRepository';
import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';
import FakeReasonsRepository from '@modules/reasons/repositories/fakes/FakeReasonsRepository';
import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';
import FakeReviewsRepository from '@modules/reviews/repositories/fakes/FakeReviewsRepository';
import FakeReviewsRequirementsRepository from '@modules/reviews/repositories/fakes/FakeReviewsRequirementsRepository';
import FakeTasksRepository from '@modules/tasks/repositories/fakes/FakeTasksRepository';
import FakeTaskTypesRepository from '@modules/tasks/repositories/fakes/FakeTaskTypesRepository';
import FakeTeamsRepository from '@modules/teams/repositories/fakes/FakeTeamsRepository';
import FakeContractorsRepository from '@modules/ugrs/repositories/fakes/FakeContractorsRepository';
import FakeGroupsRepository from '@modules/ugrs/repositories/fakes/FakeGroupsRepository';
import FakeUgrsRepository from '@modules/ugrs/repositories/fakes/FakeUgrsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateReviewService from '../UpdateReviewService';

let fakeReviewsRepository: FakeReviewsRepository;
let fakeReviewsRequirementsRepository: FakeReviewsRequirementsRepository;
let fakeLvsRepository: FakeLvsRepository;
let fakeLvPosRepository: FakeLvPosRepository;
let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeTaskRepository: FakeTasksRepository;
let fakeTeamsRepository: FakeTeamsRepository;
let fakeUgrsRepository: FakeUgrsRepository;
let fakeTaskTypesRepository: FakeTaskTypesRepository;
let fakeContractsRepository: FakeContractsRepository;
let fakeContractorsRepository: FakeContractorsRepository;
let fakeGroupsRepository: FakeGroupsRepository;
let fakeOrdersRepository: FakeOrdersRepository;
let fakeReasonsRepository: FakeReasonsRepository;

let fakeCacheProvider: FakeCacheProvider;
let updateReview: UpdateReviewService;

describe('UpdateReview', () => {
  beforeEach(() => {
    fakeReviewsRepository = new FakeReviewsRepository();
    fakeLvsRepository = new FakeLvsRepository();
    fakeLvPosRepository = new FakeLvPosRepository();
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeReasonsRepository = new FakeReasonsRepository();
    fakeContractsRepository = new FakeContractsRepository();
    fakeTaskRepository = new FakeTasksRepository();
    fakeTaskTypesRepository = new FakeTaskTypesRepository();
    fakeContractorsRepository = new FakeContractorsRepository();
    fakeGroupsRepository = new FakeGroupsRepository();
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeTeamsRepository = new FakeTeamsRepository();
    fakeUgrsRepository = new FakeUgrsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeReviewsRequirementsRepository = new FakeReviewsRequirementsRepository();
    updateReview = new UpdateReviewService(
      fakeReviewsRepository,
      fakeLvsRepository,
      fakeLvPosRepository,
      fakeRequirementsRepository,
      fakeReviewsRequirementsRepository,
      fakeReasonsRepository,
      fakeCacheProvider,
    );
  });
  it('should not be able to update a review with NSA value and without reason', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });
    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await expect(
      updateReview.execute({
        review_id: review.id,
        lv_id: lv.id,
        value: 'NSA',
        requirement_id: requirement.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a non-exists review', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });
    await expect(
      updateReview.execute({
        review_id: 'invalid-id',
        value: 'SAT',
        requirement_id: requirement.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a review with a requirement_id invalid', async () => {
    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });
    await expect(
      updateReview.execute({
        review_id: review.id,
        value: 'SAT',
        requirement_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a review with a reason_id invalid', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });
    await expect(
      updateReview.execute({
        value: 'SAT',
        review_id: review.id,
        requirement_id: requirement.id,
        reason_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a review with a lv_id invalid', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await expect(
      updateReview.execute({
        review_id: review.id,
        value: 'SAT',
        requirement_id: requirement.id,
        lv_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a review with a lv_pos_id invalid', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await expect(
      updateReview.execute({
        review_id: review.id,
        value: 'SAT',
        requirement_id: requirement.id,
        lv_pos_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a review if it doesnt have lv_id or lv_pos_id', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await expect(
      updateReview.execute({
        review_id: review.id,
        value: 'SAT',
        requirement_id: requirement.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a review with value is invalid', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await expect(
      updateReview.execute({
        review_id: review.id,
        value: 'Invalid Value',
        requirement_id: requirement.id,
        lv_id: lv.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a review if the value is NSA and reason is not sent', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await expect(
      updateReview.execute({
        review_id: review.id,
        value: 'NSA',
        requirement_id: requirement.id,
        lv_id: lv.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should able to update a review with a lv_id', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const review = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    await fakeReviewsRequirementsRepository.create({
      review_id: review.id,
      requirement_id: requirement.id,
      lv_id: lv.id,
      status: 'NSA',
    });

    const updatedReview = await updateReview.execute({
      requirement_id: requirement.id,
      lv_id: lv.id,
      value: 'SAT',
      review_id: review.id,
      observation: 'Observation',
    });

    expect(updatedReview.value).toEqual('SAT');
  });
  it('should be able to update a review with a lv_pos_id', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    const review = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    await fakeReviewsRequirementsRepository.create({
      review_id: review.id,
      requirement_id: requirement.id,
      lv_pos_id: lvPos.id,
      status: 'NSA',
    });

    const reason = await fakeReasonsRepository.create({
      description: 'Reason Description',
      requirement_id: requirement.id,
    });

    const updatedReview = await updateReview.execute({
      requirement_id: requirement.id,
      lv_pos_id: lvPos.id,
      value: 'SAT',
      review_id: review.id,
      reason_id: reason.id,
    });

    expect(updatedReview.value).toEqual('SAT');
  });
  it('should not able to update requirementsReview with a lv_id', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const review = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    const review2 = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    await fakeReviewsRequirementsRepository.create({
      review_id: review.id,
      requirement_id: requirement.id,
      lv_id: lv.id,
      status: 'SAT',
    });

    await expect(
      updateReview.execute({
        requirement_id: requirement.id,
        lv_id: lv.id,
        value: 'SAT',
        review_id: review2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update requirementsReview with a lv_pos_id', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    const review = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    const review2 = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    await fakeReviewsRequirementsRepository.create({
      review_id: review.id,
      requirement_id: requirement.id,
      lv_pos_id: lvPos.id,
      status: 'SAT',
    });

    await expect(
      updateReview.execute({
        requirement_id: requirement.id,
        lv_pos_id: lvPos.id,
        value: 'SAT',
        review_id: review2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update requirementsReview with a lv_pos_id', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    const lvPos = await fakeLvPosRepository.create({
      contract_id: contract.id,
      date: new Date(),
      time: new Date(),
      task_start_id: task.id,
      task_end_id: task.id,
      ugr_id: ugr.id,
      group_id: group.id,
      address: 'Address',
      contractor_id: contractor.id,
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
      badge_capa: '',
      badge_solo: '',
      lv_id: lv.id,
      location: '',
    });

    await fakeReviewsRepository.create({
      value: 'NSA',
    });

    const review2 = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    await expect(
      updateReview.execute({
        requirement_id: requirement.id,
        lv_pos_id: lvPos.id,
        value: 'SAT',
        review_id: review2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update requirementsReview with a lv_id', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const contract = await fakeContractsRepository.create({
      description: 'Contract Description',
      objective: 'Contract Objective',
      title: 'Contract Title',
      enabled: true,
    });

    const task = await fakeTaskRepository.create({
      description: 'Task Description',
      enabled: true,
      type: 'Serviço',
    });

    const ugr = await fakeUgrsRepository.create({
      name: 'Ugr Title',
      enabled: true,
    });

    const contractor = await fakeContractorsRepository.create({
      contract_id: contract.id,
      contract_number: '1234123412',
      name: 'Contractor Name',
      prefix: 'CN',
      ugrs: [ugr],
      enabled: true,
    });

    const taskType = await fakeTaskTypesRepository.create({
      description: 'Task Type Description',
    });

    const team = await fakeTeamsRepository.create({
      contractor_id: contractor.id,
      name: 'Team Name',
      enabled: true,
    });

    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });
    const group = await fakeGroupsRepository.create({
      name: 'Group Name',
      ugr_id: ugr.id,
      enabled: true,
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
      observation_first: 'Observation',
      observation_second: '',
      observation_third: '',
      observation_fourth: '',
      status: 'open',
      user_id: user.id,
    });

    await fakeReviewsRepository.create({
      value: 'NSA',
    });

    const review2 = await fakeReviewsRepository.create({
      value: 'NSA',
    });

    await expect(
      updateReview.execute({
        requirement_id: requirement.id,
        lv_id: lv.id,
        value: 'SAT',
        review_id: review2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
