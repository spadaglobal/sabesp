import IContractorsRepository from '@modules/ugrs/repositories/IContactorsRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import Team from '../infra/typeorm/entities/Team';
import ITeamsRepository from '../repositories/ITeamsRepository';

interface IRequest {
  team_id: string;
  name: string;
  contractor_id: string;
  enabled?: boolean;
}

@injectable()
class UpdateTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
    @inject('ContractorsRepository')
    private contractorsRepository: IContractorsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    team_id,
    name,
    contractor_id,
    enabled,
  }: IRequest): Promise<Team> {
    const team = await this.teamsRepository.findById(team_id);

    if (!team) {
      throw new AppError('Team not found!');
    }

    const checkContractorExists = await this.contractorsRepository.findById(
      contractor_id,
    );

    if (!checkContractorExists) {
      throw new AppError('Contractor not found!');
    }

    team.name = name;
    team.contractor_id = contractor_id;
    team.contractor = checkContractorExists;

    if (typeof enabled !== 'undefined') team.enabled = enabled;

    await this.teamsRepository.save(team);

    await this.cacheProvider.invalidatePrefix('teams-list');

    return team;
  }
}

export default UpdateTeamService;
