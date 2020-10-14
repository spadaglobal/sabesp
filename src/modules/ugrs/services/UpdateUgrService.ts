import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Ugr from '../infra/typeorm/entities/Ugr';
import IUgrsRepository from '../repositories/IUgrsRepository';

interface IRequest {
  ugr_id: string;
  name: string;
  enabled?: boolean;
}

@injectable()
class UpdateUgrService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ ugr_id, name, enabled }: IRequest): Promise<Ugr> {
    const ugr = await this.ugrsRepository.findById(ugr_id);

    if (!ugr) {
      throw new AppError('Ugr not found!');
    }

    ugr.name = name;

    if (typeof enabled !== 'undefined') ugr.enabled = enabled;

    await this.ugrsRepository.save(ugr);

    await this.cacheProvider.invalidatePrefix('ugrs-list');

    return ugr;
  }
}

export default UpdateUgrService;
