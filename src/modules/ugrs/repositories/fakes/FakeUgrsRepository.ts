import ICreateUgrDTO from '@modules/ugrs/dtos/ICreateUgrDTO';
import Ugr from '@modules/ugrs/infra/typeorm/entities/Ugr';
import { uuid } from 'uuidv4';

import IUgrsRepository from '../IUgrsRepository';

class FakeUgrsRepository implements IUgrsRepository {
  private ugrs: Ugr[] = [];

  public async findById(id: string): Promise<Ugr | undefined> {
    const ugrFound = this.ugrs.find(ugr => ugr.id === id);
    return ugrFound;
  }

  public async create(ugrData: ICreateUgrDTO): Promise<Ugr> {
    const ugr = new Ugr();
    Object.assign(ugr, { id: uuid() }, ugrData);

    this.ugrs.push(ugr);

    return ugr;
  }

  public async remove(ugr: Ugr): Promise<void> {
    const findIndexUgr = this.ugrs.findIndex(findUgr => findUgr.id === ugr.id);

    this.ugrs.splice(findIndexUgr, 1);
  }

  public async save(ugr: Ugr): Promise<Ugr> {
    const findIndex = this.ugrs.findIndex(findUgr => findUgr.id === ugr.id);
    this.ugrs[findIndex] = ugr;
    return ugr;
  }
}

export default FakeUgrsRepository;
