import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Reason from '../infra/typeorm/entities/Reason';
import IReasonsRepository from '../repositories/IReasonsRepository';

interface IRequest {
  reason_id: string;
}

@injectable()
class FindReasonService {
  constructor(
    @inject('ReasonsRepository')
    private reasonsRepository: IReasonsRepository,
  ) {}

  public async execute({ reason_id }: IRequest): Promise<Reason> {
    const reason = await this.reasonsRepository.findById(reason_id);

    if (!reason) {
      throw new AppError('Reason not found!');
    }

    return reason;
  }
}

export default FindReasonService;
