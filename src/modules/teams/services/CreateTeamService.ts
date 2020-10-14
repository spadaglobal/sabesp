import IContractorsRepository from '@modules/ugrs/repositories/IContactorsRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Team from '../infra/typeorm/entities/Team';
import ITeamsRepository from '../repositories/ITeamsRepository';

interface IRequest {
  name: string;
  contractor_id: string;
  enabled?: boolean;
}

@injectable()
class CreateTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    contractor_id,
    enabled,
  }: IRequest): Promise<Team> {
    const checkContractorExists = await this.contractorsRepository.findById(
      contractor_id,
    );

    if (!checkContractorExists) {
      throw new AppError('Contractor not found!');
    }

    const team = await this.teamsRepository.create({
      name,
      contractor_id,
      enabled,
    });

    await this.cacheProvider.invalidatePrefix('teams-list');

    return team;
  }
}

export default CreateTeamService;
