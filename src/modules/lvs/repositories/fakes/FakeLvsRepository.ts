import ICreateLvDTO from '@modules/lvs/dtos/ICreateLvDTO';
import Lv from '@modules/lvs/infra/typeorm/entities/Lv';
import { uuid } from 'uuidv4';

import ILvsRepository from '../ILvsRepository';

class FakeLvsRepository implements ILvsRepository {
  private lvs: Lv[] = [];

  public async findById(id: string): Promise<Lv | undefined> {
    const lvFound = this.lvs.find(lv => lv.id === id);
    return lvFound;
  }

  public async create(lvData: ICreateLvDTO): Promise<Lv> {
    const lv = new Lv();
    Object.assign(lv, { id: uuid() }, lvData);

    this.lvs.push(lv);

    return lv;
  }

  public async remove(lv_id: string): Promise<void> {
    const findIndexLv = this.lvs.findIndex(findLv => findLv.id === lv_id);

    this.lvs.splice(findIndexLv, 1);
  }

  public async save(lv: Lv): Promise<Lv> {
    const findIndex = this.lvs.findIndex(findLv => findLv.id === lv.id);
    this.lvs[findIndex] = lv;
    return lv;
  }
}

export default FakeLvsRepository;
