import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import ITeamsRepository from '../repositories/ITeamsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  exclude: boolean;
}
@injectable()
class ListTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let teams = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `teams-list:${options.page}:${exclude}`,
    );

    if (!teams) {
      if (exclude === false) {
        teams = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['contractor'],
          },
        });
      } else {
        teams = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            relations: ['contractor'],
            where: { enabled: true },
            order: {
              created_at: 'DESC',
            },
          },
        });
      }

      await this.cacheProvider.save(
        `teams-list:${options.page}:${exclude}`,
        teams,
      );
    }

    return teams;
  }
}

export default ListTeamService;
