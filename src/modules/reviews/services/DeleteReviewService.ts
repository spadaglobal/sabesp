import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IReviewsRepository from '../repositories/IReviewsRepository';

interface IRequest {
  review_id: string;
}

@injectable()
class DeleteReviewService {
  constructor(
    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ review_id }: IRequest): Promise<void> {
    const review = await this.reviewsRepository.findById(review_id);

    if (!review) {
      throw new AppError('Review not found!');
    }

    await this.cacheProvider.invalidatePrefix('reviews-list');

    await this.reviewsRepository.remove(review.id);
  }
}

export default DeleteReviewService;
