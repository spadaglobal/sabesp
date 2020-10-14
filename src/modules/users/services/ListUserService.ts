import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';

import IUsersRepository from '../repositories/IUsersRepository';

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
class ListUserService {
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
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let users = await this.cacheProvider.recover<IPaginationResponseDTO | []>(
      `users-list:${options.page}:${exclude}`,
    );

    if (!users) {
      if (exclude === false) {
        users = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            where: {
              enabled: true,
            },
            select: ['id', 'name', 'email', 'role', 'enabled', 'avatar'],
            order: {
              created_at: 'DESC',
            },
          },
        });
      } else {
        users = await this.paginationProvider.pagination({
          options,
          entity,
          searchOptions: {
            where: { enabled: false },
            select: ['id', 'name', 'email', 'role', 'enabled', 'avatar'],
            order: {
              created_at: 'DESC',
            },
          },
        });
      }

      // Salva a query na cache

      await this.cacheProvider.save(
        `users-list:${options.page}:${exclude}`,
        users,
      );
    }

    return users;
  }
}

export default ListUserService;
