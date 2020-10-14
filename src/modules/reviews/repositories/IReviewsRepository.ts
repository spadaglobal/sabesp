import ICreateReviewDTO from '../dtos/ICreateReviewDTO';
import Review from '../infra/typeorm/entities/Review';

export default interface IReviewsRepository {
  findById(id: string): Promise<Review | undefined>;
  create(data: ICreateReviewDTO): Promise<Review>;
  remove(review_id: string): Promise<void>;
  save(review: Review): Promise<Review>;
}
