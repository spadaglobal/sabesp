import FakeReasonsRepository from '@modules/reasons/repositories/fakes/FakeReasonsRepository';
import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateReasonService from '../CreateReasonService';

let fakeReasonsRepository: FakeReasonsRepository;
let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createReason: CreateReasonService;

describe('CreateReason', () => {
  beforeEach(() => {
    fakeReasonsRepository = new FakeReasonsRepository();
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createReason = new CreateReasonService(
      fakeReasonsRepository,
      fakeRequirementsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new reason', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });
    const reason = await createReason.execute({
      description: 'Reason Description',
      requirement_id: requirement.id,
    });

    expect(reason).toHaveProperty('id');
  });
  it('should not be able to create a new reason if requirement is not valid', async () => {
    await expect(
      createReason.execute({
        description: 'Reason Description',
        requirement_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
