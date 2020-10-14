import ICreateUgrDTO from '@modules/ugrs/dtos/ICreateUgrDTO';
import IUgrsRepository from '@modules/ugrs/repositories/IUgrsRepository';
import { Repository, getRepository } from 'typeorm';

import Ugr from '../entities/Ugr';

class UgrsRepository implements IUgrsRepository {
  private ormRepository: Repository<Ugr>;

  constructor() {
    this.ormRepository = getRepository(Ugr);
  }

  public async findById(id: string): Promise<Ugr | undefined> {
    const ugr = await this.ormRepository.findOne(id);
    return ugr;
  }

  public async create(ugrData: ICreateUgrDTO): Promise<Ugr> {
    const ugr = this.ormRepository.create(ugrData);
    await this.ormRepository.save(ugr);
    return ugr;
  }

  public async remove(ugr: Ugr): Promise<void> {
    await this.ormRepository.delete(ugr);
  }

  public async save(ugr: Ugr): Promise<Ugr> {
    return this.ormRepository.save(ugr);
  }
}

export default UgrsRepository;
