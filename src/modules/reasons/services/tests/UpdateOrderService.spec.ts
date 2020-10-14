import FakeReasonsRepository from '@modules/reasons/repositories/fakes/FakeReasonsRepository';
import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateReasonService from '../UpdateReasonService';

let fakeReasonsRepository: FakeReasonsRepository;
let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateReason: UpdateReasonService;

describe('UpdateReason', () => {
  beforeEach(() => {
    fakeReasonsRepository = new FakeReasonsRepository();
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateReason = new UpdateReasonService(
      fakeReasonsRepository,
      fakeRequirementsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update the reason', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const reason = await fakeReasonsRepository.create({
      description: 'Reason Description',
      requirement_id: requirement.id,
    });

    const updatedReason = await updateReason.execute({
      reason_id: reason.id,
      description: 'Reason Description Updated',
      requirement_id: requirement.id,
    });

    expect(updatedReason.description).toBe('Reason Description Updated');
  });
  it('should not be able to update a reason with requirement invalid', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const reason = await fakeReasonsRepository.create({
      description: 'Reason Description',
      requirement_id: requirement.id,
    });

    await expect(
      updateReason.execute({
        reason_id: reason.id,
        description: 'Reason Description',
        requirement_id: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update a non-exists reason', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    await expect(
      updateReason.execute({
        reason_id: 'non-exists-id',
        description: 'Reason Description',
        requirement_id: requirement.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
