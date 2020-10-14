import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import LvPos from '../infra/typeorm/entities/LvPos';
import ILvPosRepository from '../repositories/ILvPosRepository';

interface IRequest {
  lv_pos_id: string;
}

@injectable()
class FindLvPosService {
  constructor(
    @inject('LvPosRepository')
    private lvPosRepository: ILvPosRepository,
  ) {}

  public async execute({ lv_pos_id }: IRequest): Promise<LvPos> {
    const lvPos = await this.lvPosRepository.findById(lv_pos_id);

    if (!lvPos) {
      throw new AppError('Lv Pos not found!');
    }

    return lvPos;
  }
}

export default FindLvPosService;
