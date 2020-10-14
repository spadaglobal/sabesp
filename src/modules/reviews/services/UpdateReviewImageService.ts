import Review from '@modules/reviews/infra/typeorm/entities/Review';
import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

import IReviewsRepository from '../repositories/IReviewsRepository';

interface IRequest {
  review_id: string;
  filename: string;
}

@injectable()
class UpdateReviewImageService {
  constructor(
    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ review_id, filename }: IRequest): Promise<Review> {
    const review = await this.reviewsRepository.findById(review_id);

    if (!review) {
      throw new AppError(
        'Only authenticated reviews can change the image.',
        401,
      );
    }

    if (review.image) {
      await this.storageProvider.deleteFile(review.image);
    }

    const file = await this.storageProvider.saveFile(filename);

    review.image = file;

    await this.reviewsRepository.save(review);

    await this.cacheProvider.invalidatePrefix('reviews-list');

    return review;
  }
}

export default UpdateReviewImageService;
