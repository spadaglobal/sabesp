import ICreateLvPosDTO from '@modules/lvPos/dtos/ICreateLvPosDTO';
import ILvPosRepository from '@modules/lvPos/repositories/ILvPosRepository';
import { Repository, getRepository } from 'typeorm';

import LvPos from '../entities/LvPos';

class LvPosRepository implements ILvPosRepository {
  private ormRepository: Repository<LvPos>;

  constructor() {
    this.ormRepository = getRepository(LvPos);
  }

  public async findById(id: string): Promise<LvPos | undefined> {
    const lvPos = await this.ormRepository.findOne(id);
    return lvPos;
  }

  public async create(lvPosData: ICreateLvPosDTO): Promise<LvPos> {
    const lvPos = this.ormRepository.create(lvPosData);
    await this.ormRepository.save(lvPos);
    return lvPos;
  }

  public async remove(lvPos_id: string): Promise<void> {
    await this.ormRepository.delete(lvPos_id);
  }

  public async save(lvPos: LvPos): Promise<LvPos> {
    return this.ormRepository.save(lvPos);
  }
}

export default LvPosRepository;
