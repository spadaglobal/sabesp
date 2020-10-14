import { inject, injectable } from 'tsyringe';

import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';
import ILike from '@shared/infra/typeorm/implementations';

import IContractorsRepository from '../repositories/IContactorsRepository';

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
class ListFilteredContractorService {
  constructor(
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
    name,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let contractors: IPaginationResponseDTO | [] = [];

    if (exclude === false) {
      contractors = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugrs', 'contract'],
          where: {
            name: ILike(`%${name}%`),
          },
        },
      });
    } else {
      contractors = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          relations: ['ugrs', 'contract'],
          where: { enabled: true, name: ILike(`%${name}%`) },
        },
      });
    }

    return contractors;
  }
}

export default ListFilteredContractorService;
