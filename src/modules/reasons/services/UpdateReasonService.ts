import IRequirementsRepository from '@modules/requirements/repositories/IRequirementsRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Reason from '../infra/typeorm/entities/Reason';
import IReasonsRepository from '../repositories/IReasonsRepository';

interface IRequest {
  reason_id: string;
  description: string;
  requirement_id: string;
}

@injectable()
class UpdateReasonService {
  constructor(
    @inject('ReasonsRepository')
    private reasonsRepository: IReasonsRepository,
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    reason_id,
    description,
    requirement_id,
  }: IRequest): Promise<Reason> {
    const reason = await this.reasonsRepository.findById(reason_id);

    if (!reason) {
      throw new AppError('Reason not found!');
    }

    const checkRequirementExists = await this.requirementsRepository.findById(
      requirement_id,
    );

    if (!checkRequirementExists) {
      throw new AppError('Requirement not found!');
    }

    reason.description = description;
    reason.requirement_id = requirement_id;

    await this.reasonsRepository.save(reason);

    await this.cacheProvider.invalidatePrefix('reasons-list');

    return reason;
  }
}

export default UpdateReasonService;
