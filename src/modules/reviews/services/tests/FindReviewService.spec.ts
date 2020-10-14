import FakeReviewsRepository from '@modules/reviews/repositories/fakes/FakeReviewsRepository';

import AppError from '@shared/errors/AppError';

import FindReviewService from '../FindReviewService';

let fakeReviewsRepository: FakeReviewsRepository;
let findReview: FindReviewService;

describe('FindReview', () => {
  beforeEach(() => {
    fakeReviewsRepository = new FakeReviewsRepository();
    findReview = new FindReviewService(fakeReviewsRepository);
  });
  it('should be able to return the review', async () => {
    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    const findedReview = await findReview.execute({
      review_id: review.id,
    });

    expect(findedReview.id).toEqual(review.id);
  });
  it('should not be able to return a non-exists review', async () => {
    await expect(
      findReview.execute({
        review_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
