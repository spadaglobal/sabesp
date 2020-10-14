import ICreateLvPosDTO from '@modules/lvPos/dtos/ICreateLvPosDTO';
import LvPos from '@modules/lvPos/infra/typeorm/entities/LvPos';
import { uuid } from 'uuidv4';

import ILvPosRepository from '../ILvPosRepository';

class FakeLvPosRepository implements ILvPosRepository {
  private lvPos: LvPos[] = [];

  public async findById(id: string): Promise<LvPos | undefined> {
    const lvPosFound = this.lvPos.find(lvPos => lvPos.id === id);
    return lvPosFound;
  }

  public async create(lvPosData: ICreateLvPosDTO): Promise<LvPos> {
    const lvPos = new LvPos();
    Object.assign(lvPos, { id: uuid() }, lvPosData);

    this.lvPos.push(lvPos);

    return lvPos;
  }

  public async remove(lvPos_id: string): Promise<void> {
    const findIndexLvPos = this.lvPos.findIndex(
      findLvPos => findLvPos.id === lvPos_id,
    );

    this.lvPos.splice(findIndexLvPos, 1);
  }

  public async save(lvPos: LvPos): Promise<LvPos> {
    const findIndex = this.lvPos.findIndex(
      findLvPos => findLvPos.id === lvPos.id,
    );
    this.lvPos[findIndex] = lvPos;
    return lvPos;
  }
}

export default FakeLvPosRepository;
