import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IUgrsRepository from '../repositories/IUgrsRepository';

interface IRequest {
  ugr_id: string;
}

@injectable()
class DisableUgrService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ ugr_id }: IRequest): Promise<void> {
    const ugr = await this.ugrsRepository.findById(ugr_id);

    if (!ugr || !ugr.enabled) {
      throw new AppError('Ugr not found or it is already disable');
    }

    ugr.enabled = false;

    await this.cacheProvider.invalidatePrefix('ugrs-list');

    await this.ugrsRepository.save(ugr);
  }
}

export default DisableUgrService;
