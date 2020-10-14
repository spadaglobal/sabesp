import ICreateGroupDTO from '../dtos/ICreateGroupDTO';
import Group from '../infra/typeorm/entities/Group';

export default interface IGroupsRepository {
  findByUgr(ugr_id: string): Promise<Group | undefined>;
  findById(id: string): Promise<Group | undefined>;
  create(data: ICreateGroupDTO): Promise<Group>;
  remove(group: Group): Promise<void>;
  save(group: Group): Promise<Group>;
}
