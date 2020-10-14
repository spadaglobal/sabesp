import ICreateReviewsRequirementsDTO from '@modules/reviews/dtos/ICreateReviewsRequirementsDTO';
import ReviewsRequirements from '@modules/reviews/infra/typeorm/entities/ReviewsRequirements';
import { uuid } from 'uuidv4';

import IReviewsRequirementsRepository from '../IReviewsRequirementsRepository';

class FakeReviewsRequirementsRepository
  implements IReviewsRequirementsRepository {
  private reviewsRequirements: ReviewsRequirements[] = [];

  public async findByLvRequirement(
    requirement_id: string,
    lv_id?: string,
    lv_pos_id?: string,
  ): Promise<ReviewsRequirements | undefined> {
    let reviewsRequirements: ReviewsRequirements | undefined;
    if (lv_id) {
      reviewsRequirements = this.reviewsRequirements.find(
        reviewsRequirement =>
          reviewsRequirement.requirement_id === requirement_id &&
          reviewsRequirement.lv_id === lv_id,
      );
    }
    if (lv_pos_id) {
      reviewsRequirements = this.reviewsRequirements.find(
        reviewsRequirement =>
          reviewsRequirement.requirement_id === requirement_id &&
          reviewsRequirement.lv_pos_id === lv_pos_id,
      );
    }
    return reviewsRequirements;
  }

  public async create(
    reviewsRequirementData: ICreateReviewsRequirementsDTO,
  ): Promise<ReviewsRequirements> {
    const reviewsRequirement = new ReviewsRequirements();
    Object.assign(reviewsRequirement, { id: uuid() }, reviewsRequirementData);

    this.reviewsRequirements.push(reviewsRequirement);

    return reviewsRequirement;
  }

  public async save(review: ReviewsRequirements): Promise<ReviewsRequirements> {
    const findIndex = this.reviewsRequirements.findIndex(
      findReview => findReview.id === review.id,
    );
    this.reviewsRequirements[findIndex] = review;
    return review;
  }
}

export default FakeReviewsRequirementsRepository;
