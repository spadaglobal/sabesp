import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Ugr from '../infra/typeorm/entities/Ugr';
import IUgrsRepository from '../repositories/IUgrsRepository';

interface IRequest {
  name: string;
  enabled?: boolean;
}

@injectable()
class CreateUgrService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, enabled }: IRequest): Promise<Ugr> {
    const ugr = await this.ugrsRepository.create({
      name,
      enabled,
    });

    await this.cacheProvider.invalidatePrefix('ugrs-list');

    return ugr;
  }
}

export default CreateUgrService;
