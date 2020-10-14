import { inject, injectable } from 'tsyringe';

import Team from '../infra/typeorm/entities/Team';
import ITeamsRepository from '../repositories/ITeamsRepository';

interface IRequest {
  ugr_id: string;
  exclude: boolean;
}
@injectable()
class ListTeamService {
  constructor(
    @inject('TeamsRepository')
    private teamsRepository: ITeamsRepository,
  ) {}

  public async execute({
    ugr_id,
    exclude,
  }: IRequest): Promise<Team[] | undefined> {
    const teams = await this.teamsRepository.findByUgr(ugr_id, exclude);

    return teams;
  }
}

export default ListTeamService;
