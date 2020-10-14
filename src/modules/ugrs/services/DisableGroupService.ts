import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IGroupsRepository from '../repositories/IGroupsRepository';

interface IRequest {
  group_id: string;
}

@injectable()
class DisableGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ group_id }: IRequest): Promise<void> {
    const group = await this.groupsRepository.findById(group_id);

    if (!group || !group.enabled) {
      throw new AppError('Group not found or it is already disable');
    }

    group.enabled = false;

    await this.cacheProvider.invalidatePrefix('groups-list');

    await this.groupsRepository.save(group);
  }
}

export default DisableGroupService;
