import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IRequirementsRepository from '../repositories/IRequirementsRepository';

interface IRequest {
  requirement_id: string;
}

@injectable()
class FindRequirementService {
  constructor(
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
  ) {}

  public async execute({ requirement_id }: IRequest): Promise<Requirement> {
    const requirement = await this.requirementsRepository.findById(
      requirement_id,
    );

    if (!requirement) {
      throw new AppError('Requirement not found');
    }
    return requirement;
  }
}

export default FindRequirementService;
