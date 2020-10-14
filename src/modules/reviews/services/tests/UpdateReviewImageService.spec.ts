import FakeReviewsRepository from '@modules/reviews/repositories/fakes/FakeReviewsRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

import UpdateReviewImageService from '../UpdateReviewImageService';

let fakeReviewsRepository: FakeReviewsRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCacheProvider: FakeCacheProvider;
let updateReviewAvatar: UpdateReviewImageService;

describe('UpdateReviewAvatar', () => {
  beforeEach(() => {
    fakeReviewsRepository = new FakeReviewsRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCacheProvider = new FakeCacheProvider();
    updateReviewAvatar = new UpdateReviewImageService(
      fakeReviewsRepository,
      fakeStorageProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to change the review avatar', async () => {
    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await updateReviewAvatar.execute({
      review_id: review.id,
      filename: 'avatar.jpg',
    });

    expect(review.image).toBe('avatar.jpg');
  });

  it('should not be able to change the review avatar if the review doesnt exists ', async () => {
    await expect(
      updateReviewAvatar.execute({
        review_id: 'non-existing-id',
        filename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete the old avatar when a new one is uploaded', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const review = await fakeReviewsRepository.create({
      value: 'SAT',
    });

    await updateReviewAvatar.execute({
      review_id: review.id,
      filename: 'avatar.jpg',
    });

    await updateReviewAvatar.execute({
      review_id: review.id,
      filename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(review.image).toBe('avatar2.jpg');
  });
});
