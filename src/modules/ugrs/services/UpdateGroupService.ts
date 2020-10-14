import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Group from '../infra/typeorm/entities/Group';
import IGroupsRepository from '../repositories/IGroupsRepository';
import IUgrsRepository from '../repositories/IUgrsRepository';

interface IRequest {
  group_id: string;
  name: string;
  enabled?: boolean;
  ugr_id?: string;
}

@injectable()
class UpdateGroupService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    group_id,
    name,
    enabled,
    ugr_id,
  }: IRequest): Promise<Group> {
    const group = await this.groupsRepository.findById(group_id);

    if (!group) {
      throw new AppError('Group not found!');
    }

    group.name = name;

    if (typeof enabled !== 'undefined') group.enabled = enabled;

    if (ugr_id) {
      const ugr = await this.ugrsRepository.findById(ugr_id);
      if (!ugr) {
        throw new AppError('Ugr not found');
      }
      group.ugr_id = ugr.id;
      group.ugr = ugr;
    }

    await this.groupsRepository.save(group);

    await this.cacheProvider.invalidatePrefix('groups-list');

    return group;
  }
}

export default UpdateGroupService;
