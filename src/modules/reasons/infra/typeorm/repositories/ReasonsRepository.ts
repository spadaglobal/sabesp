import ICreateReasonDTO from '@modules/reasons/dtos/ICreateReasonDTO';
import IReasonsRepository from '@modules/reasons/repositories/IReasonsRepository';
import { Repository, getRepository } from 'typeorm';

import Reason from '../entities/Reason';

class ReasonsRepository implements IReasonsRepository {
  private ormRepository: Repository<Reason>;

  constructor() {
    this.ormRepository = getRepository(Reason);
  }

  public async findById(id: string): Promise<Reason | undefined> {
    const reason = await this.ormRepository.findOne(id);
    return reason;
  }

  public async create(reasonData: ICreateReasonDTO): Promise<Reason> {
    const reason = this.ormRepository.create(reasonData);
    await this.ormRepository.save(reason);
    return reason;
  }

  public async remove(reason_id: string): Promise<void> {
    await this.ormRepository.delete(reason_id);
  }

  public async save(reason: Reason): Promise<Reason> {
    return this.ormRepository.save(reason);
  }
}

export default ReasonsRepository;
