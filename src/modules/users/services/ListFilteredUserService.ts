import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';
import iLike from '@shared/infra/typeorm/implementations';

import IUsersRepository from '../repositories/IUsersRepository';

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
class ListFilteredUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
    name,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let users: IPaginationResponseDTO | [] = [];

    if (exclude === false) {
      users = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: {
            name: iLike(`%${name}%`),
          },
          select: ['id', 'name', 'email', 'role', 'enabled', 'avatar'],
        },
      });
    } else {
      users = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: { enabled: true, name: iLike(`%${name}%`) },
          select: ['id', 'name', 'email', 'role', 'enabled', 'avatar'],
        },
      });
    }

    return users;
  }
}

export default ListFilteredUserService;
