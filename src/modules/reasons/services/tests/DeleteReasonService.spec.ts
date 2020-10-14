import FakeReasonsRepository from '@modules/reasons/repositories/fakes/FakeReasonsRepository';
import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateReasonService from '../CreateReasonService';
import DeleteReasonService from '../DeleteReasonService';

let fakeReasonsRepository: FakeReasonsRepository;
let fakeRequirementsRepository: FakeRequirementsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createReason: CreateReasonService;
let deleteReason: DeleteReasonService;

describe('DeleteReason', () => {
  beforeEach(() => {
    fakeReasonsRepository = new FakeReasonsRepository();
    fakeRequirementsRepository = new FakeRequirementsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteReason = new DeleteReasonService(
      fakeReasonsRepository,
      fakeCacheProvider,
    );
    createReason = new CreateReasonService(
      fakeReasonsRepository,
      fakeRequirementsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to delete a reason', async () => {
    const remove = jest.spyOn(fakeReasonsRepository, 'remove');

    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });
    const reason = await createReason.execute({
      description: 'Reason Description',
      requirement_id: requirement.id,
    });

    await deleteReason.execute({
      reason_id: reason.id,
    });

    expect(remove).toBeCalledWith(reason.id);
  });
  it('should be not able to delete a non-exists reason', async () => {
    await expect(
      deleteReason.execute({
        reason_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
