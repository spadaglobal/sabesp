import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import ITeamsRepository from '../repositories/ITeamsRepository';

interface IRequest {
  team_id: string;
}

@injectable()
class DisableTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ team_id }: IRequest): Promise<void> {
    const team = await this.teamsRepository.findById(team_id);

    if (!team || !team.enabled) {
      throw new AppError('Team not found or it is already disable');
    }

    team.enabled = false;

    await this.cacheProvider.invalidatePrefix('teams-list');

    await this.teamsRepository.save(team);
  }
}

export default DisableTeamService;
