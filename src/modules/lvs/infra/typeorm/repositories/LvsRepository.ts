import ICreateLvDTO from '@modules/lvs/dtos/ICreateLvDTO';
import ILvsRepository from '@modules/lvs/repositories/ILvsRepository';
import { Repository, getRepository } from 'typeorm';

import Lv from '../entities/Lv';

class LvsRepository implements ILvsRepository {
  private ormRepository: Repository<Lv>;

  constructor() {
    this.ormRepository = getRepository(Lv);
  }

  public async findById(id: string): Promise<Lv | undefined> {
    const lv = await this.ormRepository.findOne(id);
    return lv;
  }

  public async create(lvData: ICreateLvDTO): Promise<Lv> {
    const lv = this.ormRepository.create(lvData);
    await this.ormRepository.save(lv);
    return lv;
  }

  public async remove(lv_id: string): Promise<void> {
    await this.ormRepository.delete(lv_id);
  }

  public async save(lv: Lv): Promise<Lv> {
    return this.ormRepository.save(lv);
  }
}

export default LvsRepository;
