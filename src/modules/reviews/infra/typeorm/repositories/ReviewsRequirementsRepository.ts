import ICreateReviewsRequirementsDTO from '@modules/reviews/dtos/ICreateReviewsRequirementsDTO';
import IReviewsRequirementsRepository from '@modules/reviews/repositories/IReviewsRequirementsRepository';
import { Repository, getRepository } from 'typeorm';

import ReviewsRequirements from '../entities/ReviewsRequirements';

class ReviewsRequirementsRepository implements IReviewsRequirementsRepository {
  private ormRepository: Repository<ReviewsRequirements>;

  constructor() {
    this.ormRepository = getRepository(ReviewsRequirements);
  }

  public async findByLvRequirement(
    requirement_id: string,
    lv_id?: string,
    lv_pos_id?: string,
  ): Promise<ReviewsRequirements | undefined> {
    let reviewRequirements: ReviewsRequirements | undefined;
    if (lv_id) {
      reviewRequirements = await this.ormRepository.findOne({
        requirement_id,
        lv_id,
      });
    }
    if (lv_pos_id) {
      reviewRequirements = await this.ormRepository.findOne({
        requirement_id,
        lv_pos_id,
      });
    }

    return reviewRequirements;
  }

  public async create(
    reviewsRequirementData: ICreateReviewsRequirementsDTO,
  ): Promise<ReviewsRequirements> {
    const reviewRequirements = this.ormRepository.create(
      reviewsRequirementData,
    );
    await this.ormRepository.save(reviewRequirements);
    return reviewRequirements;
  }

  public async save(
    reviewRequirements: ReviewsRequirements,
  ): Promise<ReviewsRequirements> {
    return this.ormRepository.save(reviewRequirements);
  }
}

export default ReviewsRequirementsRepository;
