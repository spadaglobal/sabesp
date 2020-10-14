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
  value: string;
  requirement_id: string;
  lv_id?: string;
  lv_pos_id?: string;
  reason_id?: string;
  observation?: string;
}

@injectable()
class CreateReviewService {
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
    value,
    requirement_id,
    lv_id,
    lv_pos_id,
    reason_id,
    observation,
  }: IRequest): Promise<Review> {
    const checkRequirementExists = await this.requirementsRepository.findById(
      requirement_id,
    );
    if (!checkRequirementExists) {
      throw new AppError('Requirement not found');
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
        throw new AppError('Review Already Exists');
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
        throw new AppError('Review Already Exists');
      }
    }

    if (!lv_id && !lv_pos_id) {
      throw new AppError('You must send a lv_id or lv_pos_id');
    }

    if (reason_id) {
      const checkReasonExists = await this.reasonsRepository.findById(
        reason_id,
      );
      if (!checkReasonExists) {
        throw new AppError('Reason not found');
      }
    }

    if (value !== 'NA' && value !== 'SAT' && value !== 'NSA') {
      throw new AppError('Value wrong value');
    }

    if (!reason_id && value === 'NSA') {
      throw new AppError('Reason not found');
    }

    const review = await this.reviewsRepository.create({
      value,
      reason_id,
      observation,
    });

    await this.reviewsRequirementsRepository.create({
      requirement_id,
      review_id: review.id,
      status: value,
      lv_id,
      lv_pos_id,
    });

    await this.cacheProvider.invalidatePrefix('reviews-list');

    await this.cacheProvider.invalidate(`requirements-list::${lv_id}`);

    return review;
  }
}

export default CreateReviewService;
