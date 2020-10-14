import ICreateReviewDTO from '@modules/reviews/dtos/ICreateReviewDTO';
import Review from '@modules/reviews/infra/typeorm/entities/Review';
import { uuid } from 'uuidv4';

import IReviewsRepository from '../IReviewsRepository';

class FakeReviewsRepository implements IReviewsRepository {
  private reviews: Review[] = [];

  public async findById(id: string): Promise<Review | undefined> {
    const reviewFound = this.reviews.find(review => review.id === id);
    return reviewFound;
  }

  public async create(reviewData: ICreateReviewDTO): Promise<Review> {
    const review = new Review();
    Object.assign(review, { id: uuid() }, reviewData);

    this.reviews.push(review);

    return review;
  }

  public async remove(review_id: string): Promise<void> {
    const findIndexReview = this.reviews.findIndex(
      findReview => findReview.id === review_id,
    );

    this.reviews.splice(findIndexReview, 1);
  }

  public async save(review: Review): Promise<Review> {
    const findIndex = this.reviews.findIndex(
      findReview => findReview.id === review.id,
    );
    this.reviews[findIndex] = review;
    return review;
  }
}

export default FakeReviewsRepository;
