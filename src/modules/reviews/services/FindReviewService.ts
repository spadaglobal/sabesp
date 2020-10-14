import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Review from '../infra/typeorm/entities/Review';
import IReviewsRepository from '../repositories/IReviewsRepository';

interface IRequest {
  review_id: string;
}

@injectable()
class FindReviewService {
  constructor(
    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository,
  ) {}

  public async execute({ review_id }: IRequest): Promise<Review> {
    const review = await this.reviewsRepository.findById(review_id);

    if (!review) {
      throw new AppError('Review not found!');
    }

    return review;
  }
}

export default FindReviewService;
