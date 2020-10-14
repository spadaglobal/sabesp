/* istanbul ignore file */
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IReviewsRepository from '../repositories/IReviewsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  lv_pos_id: string;
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
    lv_pos_id,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let reviews = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `reviews-list:${options.page}`,
    );

    if (!reviews) {
      reviews = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: { requirement_id, lv_pos_id },
        },
      });

      await this.cacheProvider.save(`reviews-list:${options.page}`, reviews);
    }

    return reviews;
  }
}

export default ListReviewService;
