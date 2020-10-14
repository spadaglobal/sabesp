import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Group from '../infra/typeorm/entities/Group';
import IGroupsRepository from '../repositories/IGroupsRepository';
import IUgrsRepository from '../repositories/IUgrsRepository';

interface IRequest {
  name: string;
  enabled?: boolean;
  ugr_id: string;
}

@injectable()
class CreateGroupService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('GroupsRepository')
    private groupsRepository: IGroupsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, enabled, ugr_id }: IRequest): Promise<Group> {
    const ugr = await this.ugrsRepository.findById(ugr_id);

    if (!ugr) {
      throw new AppError('Ugr not found');
    }

    const group = await this.groupsRepository.create({
      name,
      enabled,
      ugr_id,
    });

    await this.cacheProvider.invalidatePrefix('groups-list');

    return group;
  }
}

export default CreateGroupService;
