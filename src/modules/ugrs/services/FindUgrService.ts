import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Ugr from '../infra/typeorm/entities/Ugr';
import IUgrsRepository from '../repositories/IUgrsRepository';

interface IRequest {
  ugr_id: string;
}

@injectable()
class FindUgrService {
  constructor(
    @inject('UgrsRepository')
    private ugrsRepository: IUgrsRepository,
  ) {}

  public async execute({ ugr_id }: IRequest): Promise<Ugr> {
    const ugr = await this.ugrsRepository.findById(ugr_id);

    if (!ugr) {
      throw new AppError('Ugr not found!');
    }

    return ugr;
  }
}

export default FindUgrService;
