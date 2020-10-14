/* istanbul ignore file */
import { inject, injectable } from 'tsyringe';
import { SelectQueryBuilder } from 'typeorm';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import Requirement from '../infra/typeorm/entities/Requirement';
import IRequirementsRepository from '../repositories/IRequirementsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  parent_id: string;
  lv_id?: string;
}

@injectable()
class ListRequirementService {
  constructor(
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
    parent_id,
    lv_id,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let requirements = await this.cacheProvider.recover<
      IPaginationResponseDTO | []
    >(`requirements-list:${options.page}:${parent_id}:${lv_id}`);

    if (!requirements) {
      if (lv_id && parent_id) {
        requirements = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['lvs'],
            where: { parent_id, lvs: { id: lv_id } },
          },
        });
      } else if (lv_id) {
        requirements = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            join: {
              alias: 'requirements',
              innerJoin: {
                grandchilds: 'requirements.grandchilds',
                lvs: 'grandchilds.lvs',
              },
            },
            where: (qb: SelectQueryBuilder<Requirement>) => {
              qb.leftJoinAndSelect('requirements.children', 'children')
                .leftJoinAndSelect('children.children', 'last')
                .leftJoinAndSelect(
                  'last.reviewsToRequirements',
                  'reviews',
                  `reviews.lv_id = '${lv_id}'`,
                )
                .where('requirements.id = grandchilds."requirementsId"')
                .andWhere('children.id = grandchilds.id')
                .andWhere('lvs.id = :id', { id: lv_id })
                .orderBy('children.title', 'ASC');
            },
            order: {
              title: 'ASC',
            },
          },
        });
      } else if (parent_id) {
        requirements = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            where: { parent_id },
          },
        });
      } else {
        requirements = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            where: { parent_id: null },
          },
        });
      }
    }

    await this.cacheProvider.save(
      `requirements-list:${parent_id}:${lv_id}`,
      requirements,
    );

    return requirements;
  }
}

export default ListRequirementService;
