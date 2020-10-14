import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IReasonsRepository from '../repositories/IReasonsRepository';

interface IRequest {
  reason_id: string;
}

@injectable()
class DeleteReasonService {
  constructor(
    @inject('ReasonsRepository')
    private reasonsRepository: IReasonsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ reason_id }: IRequest): Promise<void> {
    const reason = await this.reasonsRepository.findById(reason_id);

    if (!reason) {
      throw new AppError('Reason not found!');
    }

    await this.cacheProvider.invalidatePrefix('reasons-list');

    await this.reasonsRepository.remove(reason.id);
  }
}

export default DeleteReasonService;
