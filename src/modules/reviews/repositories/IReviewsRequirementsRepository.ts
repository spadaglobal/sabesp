import ICreateReviewsRequirementsDTO from '../dtos/ICreateReviewsRequirementsDTO';
import ReviewsRequirements from '../infra/typeorm/entities/ReviewsRequirements';

export default interface IReviewsRequirementsRepository {
  findByLvRequirement(
    requirement_id: string,
    lv_id?: string,
    lv_pos_id?: string,
  ): Promise<ReviewsRequirements | undefined>;
  create(
    reviewsRequirementData: ICreateReviewsRequirementsDTO,
  ): Promise<ReviewsRequirements>;
  save(reviewRequirements: ReviewsRequirements): Promise<ReviewsRequirements>;
}
