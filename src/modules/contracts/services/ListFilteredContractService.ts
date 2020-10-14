import { inject, injectable } from 'tsyringe';

import IPaginationResponseDTO from '@shared/container/providers/PaginationProvider/dtos/IPaginationResponseDTO';
import IPaginationProvider from '@shared/container/providers/PaginationProvider/models/IPaginationProvider';
import ILike from '@shared/infra/typeorm/implementations';

import IContractsRepository from '../repositories/IContractsRepository';

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
class ListFilteredContractService {
  constructor(
    @inject('ContractsRepository')
    private contractsRepository: IContractsRepository,
    @inject('PaginationProvider')
    private paginationProvider: IPaginationProvider,
  ) {}

  public async execute({
    options,
    entity,
    exclude,
    name,
  }: IRequest): Promise<IPaginationResponseDTO | []> {
    let contracts: IPaginationResponseDTO | [] = [];

    if (exclude === false) {
      contracts = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: {
          where: {
            title: ILike(`%${name}%`),
          },
        },
      });
    } else {
      contracts = await this.paginationProvider.pagination({
        options,
        entity,
        searchOptions: { where: { enabled: true, title: ILike(`%${name}%`) } },
      });
    }

    return contracts;
  }
}

export default ListFilteredContractService;
