import ICreateGroupDTO from '@modules/ugrs/dtos/ICreateGroupDTO';
import Group from '@modules/ugrs/infra/typeorm/entities/Group';
import { uuid } from 'uuidv4';

import IGroupsRepository from '../IGroupsRepository';

class FakeGroupsRepository implements IGroupsRepository {
  private groups: Group[] = [];

  public async findByUgr(ugr_id: string): Promise<Group | undefined> {
    const groupFound = this.groups.find(group => group.ugr_id === ugr_id);
    return groupFound;
  }

  public async findById(id: string): Promise<Group | undefined> {
    const groupFound = this.groups.find(group => group.id === id);
    return groupFound;
  }

  public async create(groupData: ICreateGroupDTO): Promise<Group> {
    const group = new Group();
    Object.assign(group, { id: uuid() }, groupData);

    this.groups.push(group);

    return group;
  }

  public async remove(group: Group): Promise<void> {
    const findIndexGroup = this.groups.findIndex(
      findGroup => findGroup.id === group.id,
    );

    this.groups.splice(findIndexGroup, 1);
  }

  public async save(group: Group): Promise<Group> {
    const findIndex = this.groups.findIndex(
      findGroup => findGroup.id === group.id,
    );
    this.groups[findIndex] = group;
    return group;
  }
}

export default FakeGroupsRepository;
