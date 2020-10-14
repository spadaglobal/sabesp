import { inject, injectable } from 'tsyringe';

import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';
import ILike from '@shared/infra/typeorm/implementations';

import IGroupsRepository from '../repositories/IGroupsRepository';

interface IRequest {
  options: {
    page: number;
    limit: number;
    route?: string;
  };
  entity: string;
  exclude: boolean;
  name: string;
}
@injectable()
class ListFilteredGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
    name,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let groups: IPaginationResponseDTO | [] = [];

    if (exclude === false) {
      groups = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr'],
          where: {
            name: ILike(`%${name}%`),
          },
        },
      });
    } else {
      groups = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugr'],
          where: { enabled: true, name: ILike(`%${name}%`) },
        },
      });
    }

    return groups;
  }
}

export default ListFilteredGroupService;
