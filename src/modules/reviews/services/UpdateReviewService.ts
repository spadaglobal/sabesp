import ILvPosRepository from '@modules/lvPos/repositories/ILvPosRepository';
import ILvsRepository from '@modules/lvs/repositories/ILvsRepository';
import IReasonsRepository from '@modules/reasons/repositories/IReasonsRepository';
import IRequirementsRepository from '@modules/requirements/repositories/IRequirementsRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Review from '../infra/typeorm/entities/Review';
import IReviewsRepository from '../repositories/IReviewsRepository';
import IReviewsRequirementsRepository from '../repositories/IReviewsRequirementsRepository';

interface IRequest {
  review_id: string;
  value: string;
  requirement_id: string;
  reason_id?: string;
  lv_id?: string;
  lv_pos_id?: string;
  observation?: string;
}

@injectable()
class UpdateReviewService {
  constructor(
    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository,
    @inject('LvsRepository')
    private lvsRepository: ILvsRepository,
    @inject('LvPosRepository')
    private lvPosRepository: ILvPosRepository,
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('ReviewsRequirementsRepository')
    private reviewsRequirementsRepository: IReviewsRequirementsRepository,
    @inject('ReasonsRepository')
    private reasonsRepository: IReasonsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    review_id,
    value,
    requirement_id,
    reason_id,
    lv_id,
    lv_pos_id,
    observation,
  }: IRequest): Promise<Review> {
    const review = await this.reviewsRepository.findById(review_id);

    if (!review) {
      throw new AppError('Review not found!');
    }

    const checkRequirementExists = await this.requirementsRepository.findById(
      requirement_id,
    );
    if (!checkRequirementExists) {
      throw new AppError('Requirement not found');
    }

    if (reason_id) {
      const checkReasonExists = await this.reasonsRepository.findById(
        reason_id,
      );
      if (!checkReasonExists) {
        throw new AppError('Reason not found');
      }
      review.reason_id = reason_id;
    }

    if (!lv_id && !lv_pos_id) {
      throw new AppError('You must send a lv_id or lv_pos_id');
    }

    if (value !== 'NA' && value !== 'SAT' && value !== 'NSA') {
      throw new AppError('Value wrong value');
    }

    if (!reason_id && value === 'NSA') {
      throw new AppError('Reason not found');
    }

    if (typeof observation !== 'undefined') {
      review.observation = observation;
    }

    if (lv_id) {
      const checkLVExists = await this.lvsRepository.findById(lv_id);
      if (!checkLVExists) {
        throw new AppError('LV not found');
      }
      const checkReviewsExists = await this.reviewsRequirementsRepository.findByLvRequirement(
        requirement_id,
        lv_id,
      );
      if (checkReviewsExists) {
        if (checkReviewsExists.review_id === review_id) {
          checkReviewsExists.lv_id = lv_id;
          checkReviewsExists.status = value;
          await this.reviewsRequirementsRepository.save(checkReviewsExists);
        } else {
          throw new AppError('This Review doent belong to this LV');
        }
      } else {
        throw new AppError('This Review doent belong to this LV');
      }
    }

    if (lv_pos_id) {
      const checkLvPosExists = await this.lvPosRepository.findById(lv_pos_id);
      if (!checkLvPosExists) {
        throw new AppError('LV Pos not found');
      }
      const checkReviewsExists = await this.reviewsRequirementsRepository.findByLvRequirement(
        requirement_id,
        undefined,
        lv_pos_id,
      );
      if (checkReviewsExists) {
        if (checkReviewsExists.review_id === review_id) {
          checkReviewsExists.lv_pos_id = lv_pos_id;
          checkReviewsExists.status = value;
          await this.reviewsRequirementsRepository.save(checkReviewsExists);
        } else {
          throw new AppError('This Review doent belong to this LV');
        }
      } else {
        throw new AppError('This Review doent belong to this LV');
      }
    }

    review.value = value;

    await this.reviewsRepository.save(review);

    await this.cacheProvider.invalidatePrefix('reviews-list');

    await this.cacheProvider.invalidate(`requirements-list::${lv_id}`);

    return review;
  }
}

export default UpdateReviewService;
