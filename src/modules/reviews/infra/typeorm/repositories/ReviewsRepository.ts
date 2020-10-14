import ICreateReviewDTO from '@modules/reviews/dtos/ICreateReviewDTO';
import IReviewsRepository from '@modules/reviews/repositories/IReviewsRepository';
import { Repository, getRepository } from 'typeorm';

import Review from '../entities/Review';

class ReviewsRepository implements IReviewsRepository {
  private ormRepository: Repository<Review>;

  constructor() {
    this.ormRepository = getRepository(Review);
  }

  public async findById(id: string): Promise<Review | undefined> {
    const review = await this.ormRepository.findOne(id);
    return review;
  }

  public async create(reviewData: ICreateReviewDTO): Promise<Review> {
    const review = this.ormRepository.create(reviewData);
    await this.ormRepository.save(review);
    return review;
  }

  public async remove(review_id: string): Promise<void> {
    await this.ormRepository.delete(review_id);
  }

  public async save(review: Review): Promise<Review> {
    return this.ormRepository.save(review);
  }
}

export default ReviewsRepository;
