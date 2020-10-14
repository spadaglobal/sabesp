import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Team from '../infra/typeorm/entities/Team';
import ITeamsRepository from '../repositories/ITeamsRepository';

interface IRequest {
  team_id: string;
}

@injectable()
class FindTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
  ) {}

  public async execute({ team_id }: IRequest): Promise<Team> {
    const team = await this.teamsRepository.findById(team_id);

    if (!team) {
      throw new AppError('Team not found!');
    }

    return team;
  }
}

export default FindTeamService;
