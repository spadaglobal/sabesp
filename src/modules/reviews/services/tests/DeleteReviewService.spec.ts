import FakeReviewsRepository from '@modules/reviews/repositories/fakes/FakeReviewsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DeleteReviewService from '../DeleteReviewService';

let fakeReviewsRepository: FakeReviewsRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteReview: DeleteReviewService;

describe('DeleteReview', () => {
  beforeEach(() => {
    fakeReviewsRepository = new FakeReviewsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteReview = new DeleteReviewService(
      fakeReviewsRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to delete a review', async () => {
    const remove = jest.spyOn(fakeReviewsRepository, 'remove');

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await deleteReview.execute({
      review_id: review.id,
    });

    expect(remove).toBeCalledWith(review.id);
  });
  it('should be not able to delete a non-exists review', async () => {
    await expect(
      deleteReview.execute({
        review_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
