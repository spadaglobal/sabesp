import FakeRequirementsRepository from '@modules/requirements/repositories/fakes/FakeRequirementsRepository';

import AppError from '@shared/errors/AppError';

import FindRequirementService from '../FindRequirementService';

let fakeRequirementsRepository: FakeRequirementsRepository;
let findRequirement: FindRequirementService;

describe('Find Requirement', () => {
  beforeEach(() => {
    fakeRequirementsRepository = new FakeRequirementsRepository();
    findRequirement = new FindRequirementService(fakeRequirementsRepository);
  });
  it('should be able to return a requirement', async () => {
    const requirement = await fakeRequirementsRepository.create({
      title: 'Requirement Title',
    });

    const findedRequirement = await findRequirement.execute({
      requirement_id: requirement.id,
    });

    expect(findedRequirement.id).toEqual(requirement.id);
  });
  it('should not be able to return a non-exists requirement', async () => {
    await expect(
      findRequirement.execute({
        requirement_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
