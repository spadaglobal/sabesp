import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Lv from '../infra/typeorm/entities/Lv';
import ILvsRepository from '../repositories/ILvsRepository';

interface IRequest {
  lv_id: string;
}

@injectable()
class FindLvService {
  constructor(
    @inject('LvsRepository')
    private lvsRepository: ILvsRepository,
  ) {}

  public async execute({ lv_id }: IRequest): Promise<Lv> {
    const lv = await this.lvsRepository.findById(lv_id);

    if (!lv) {
      throw new AppError('LV not found!');
    }

    return lv;
  }
}

export default FindLvService;
