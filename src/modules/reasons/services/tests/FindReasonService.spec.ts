import FakeReasonsRepository from '@modules/reasons/repositories/fakes/FakeReasonsRepository';
import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';

import AppError from '@shared/errors/AppError';

import FindReasonService from '../FindReasonService';

let fakeReasonsRepository: FakeReasonsRepository;
let fakeRequirementsRepository: FakeRequirementsRepository;
let findReason: FindReasonService;

describe('FindReason', () => {
  beforeEach(() => {
    fakeReasonsRepository = new FakeReasonsRepository();
    fakeRequirementsRepository = new FakeRequirementsRepository();
    findReason = new FindReasonService(fakeReasonsRepository);
  });
  it('should be able to return the reason', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });
    const reason = await fakeReasonsRepository.create({
      description: 'Reason Description',
      requirement_id: requirement.id,
    });

    const findedReason = await findReason.execute({
      reason_id: reason.id,
    });

    expect(findedReason.id).toEqual(reason.id);
  });
  it('should not be able to return a non-exists reason', async () => {
    await expect(
      findReason.execute({
        reason_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
