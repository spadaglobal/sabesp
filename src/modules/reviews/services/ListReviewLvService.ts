/* istanbul ignore file */
import { inject, injectable } from 'tsyringe';
import { SelectQueryBuilder } from 'typeorm';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import Review from '../infra/typeorm/entities/Review';
import IReviewsRepository from '../repositories/IReviewsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  lv_id: string;
  requirement_id: string;
}
@injectable()
class ListReviewService {
  constructor(
    @inject('ReviewsRepository')
    private reviewsRepository: IReviewsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
    requirement_id,
    lv_id,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let reviews = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `reviews-list:${options.page}:${requirement_id}:${lv_id}`,
    );

    if (!reviews) {
      reviews = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          join: {
            alias: 'reviews',
            innerJoin: {
              ratings: 'reviews.reviewsToRequirements',
            },
          },
          where: /* istanbul ignore next */ (
            qb: SelectQueryBuilder<Review>,
          ) => {
            qb.where({})
              .andWhere('ratings.requirement_id = :requirement_id', {
                requirement_id,
              })
              .andWhere('ratings.lv_id = :lv_id', { lv_id });
          },
        },
      });

      await this.cacheProvider.save(
        `reviews-list:${options.page}:${requirement_id}:${lv_id}`,
        reviews,
      );
    }

    return reviews;
  }
}

export default ListReviewService;
