import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Group from '../infra/typeorm/entities/Group';
import IGroupsRepository from '../repositories/IGroupsRepository';

interface IRequest {
  group_id: string;
}

@injectable()
class FindGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
  ) {}

  public async execute({ group_id }: IRequest): Promise<Group> {
    const group = await this.groupsRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found!');
    }

    return group;
  }
}

export default FindGroupService;
