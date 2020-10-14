import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IRequirementsRepository from '../repositories/IRequirementsRepository';

interface IRequest {
  requirement_id: string;
}

@injectable()
class DeleteRequirementService {
  constructor(
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ requirement_id }: IRequest): Promise<void> {
    const requirement = await this.requirementsRepository.findById(
      requirement_id,
    );

    if (!requirement) {
      throw new AppError('Requirement not found');
    }

    await this.cacheProvider.invalidatePrefix('requirements-list');

    await this.requirementsRepository.remove(requirement);
  }
}

export default DeleteRequirementService;
