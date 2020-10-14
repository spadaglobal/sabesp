import IRequirementsRepository from '@modules/requirements/repositories/IRequirementsRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Reason from '../infra/typeorm/entities/Reason';
import IReasonsRepository from '../repositories/IReasonsRepository';

interface IRequest {
  description: string;
  requirement_id: string;
}

@injectable()
class CreateReasonService {
  constructor(
    @inject('ReasonsRepository')
    private reasonsRepository: IReasonsRepository,
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    description,
    requirement_id,
  }: IRequest): Promise<Reason> {
    const checkRequirementExists = await this.requirementsRepository.findById(
      requirement_id,
    );

    if (!checkRequirementExists) {
      throw new AppError('Requirement not found!');
    }

    const reason = await this.reasonsRepository.create({
      description,
      requirement_id,
    });

    await this.cacheProvider.invalidatePrefix('reasons-list');

    return reason;
  }
}

export default CreateReasonService;
