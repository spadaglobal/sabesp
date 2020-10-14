import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import ILvPosRepository from '../repositories/ILvPosRepository';

interface IRequest {
  lv_pos_id: string;
}

@injectable()
class DeleteLvPosService {
  constructor(
    @inject('LvPosRepository')
    private lvPosRepository: ILvPosRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ lv_pos_id }: IRequest): Promise<void> {
    const lvPos = await this.lvPosRepository.findById(lv_pos_id);

    if (!lvPos) {
      throw new AppError('Lv Pos not found!');
    }

    await this.cacheProvider.invalidatePrefix('lvPos-list');

    await this.lvPosRepository.remove(lvPos.id);
  }
}

export default DeleteLvPosService;
