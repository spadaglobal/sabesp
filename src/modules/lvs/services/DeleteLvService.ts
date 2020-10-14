import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import ILvsRepository from '../repositories/ILvsRepository';

interface IRequest {
  lv_id: string;
}

@injectable()
class DeleteLvService {
  constructor(
    @inject('LvsRepository')
    private lvsRepository: ILvsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ lv_id }: IRequest): Promise<void> {
    const lv = await this.lvsRepository.findById(lv_id);

    if (!lv) {
      throw new AppError('Lv not found!');
    }

    await this.cacheProvider.invalidatePrefix('lvs-list');

    await this.lvsRepository.remove(lv.id);
  }
}

export default DeleteLvService;
