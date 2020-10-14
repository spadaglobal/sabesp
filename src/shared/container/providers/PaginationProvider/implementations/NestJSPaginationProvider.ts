import { paginate } from 'nestjs-typeorm-paginate';
import { Repository, ObjectLiteral, getRepository } from 'typeorm';

import IPaginationDTO from '../dtos/IPaginationDTO';
import IPaginationResponseDTO from '../dtos/IPaginationResponseDTO';
import IPaginationProvider from '../models/IPaginationProvider';

type IRepositoryType = Repository<Repository<Repository<ObjectLiteral>>>;
type IPaginationType = Repository<Repository<ObjectLiteral>>;

class NestJSPaginationProvider implements IPaginationProvider {
  public async pagination({
    options,
    entity,
    searchOptions,
  }: IPaginationDTO): Promise<IPaginationResponseDTO> {
    const repository = getRepository(entity);

    return paginate<IPaginationType>(
      repository as IRepositoryType,
      options,
      searchOptions,
    );
  }
}

export default NestJSPaginationProvider;
