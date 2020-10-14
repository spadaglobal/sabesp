import { inject, injectable } from 'tsyringe';

import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';
import ILike from '@shared/infra/typeorm/implementations';

import IUgrsRepository from '../repositories/IUgrsRepository';

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
class ListFilteredUgrService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
    name,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let ugrs: IPaginationResponseDTO | [] = [];

    if (exclude === false) {
      ugrs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: {
            name: ILike(`%${name}%`),
          },
        },
      });
    } else {
      ugrs = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: { where: { enabled: true, name: ILike(`%${name}%`) } },
      });
    }

    return ugrs;
  }
}

export default ListFilteredUgrService;
