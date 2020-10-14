import ICreateGroupDTO from '@modules/ugrs/dtos/ICreateGroupDTO';
import IGroupsRepository from '@modules/ugrs/repositories/IGroupsRepository';
import { Repository, getRepository } from 'typeorm';

import Group from '../entities/Group';

class GroupsRepository implements IGroupsRepository {
  private ormRepository: Repository<Group>;

  constructor() {
    this.ormRepository = getRepository(Group);
  }

  public async findByUgr(ugr_id: string): Promise<Group | undefined> {
    const group = await this.ormRepository.findOne({ ugr_id });
    return group;
  }

  public async findById(id: string): Promise<Group | undefined> {
    const group = await this.ormRepository.findOne(id, { relations: ['ugr'] });
    return group;
  }

  public async create(groupData: ICreateGroupDTO): Promise<Group> {
    const group = this.ormRepository.create(groupData);
    await this.ormRepository.save(group);
    return group;
  }

  public async remove(group: Group): Promise<void> {
    await this.ormRepository.delete(group);
  }

  public async save(group: Group): Promise<Group> {
    return this.ormRepository.save(group);
  }
}

export default GroupsRepository;
