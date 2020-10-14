import ICreateTeamDTO from '@modules/teams/dtos/ICreateTeamDTO';
import Team from '@modules/teams/infra/typeorm/entities/Team';
import { uuid } from 'uuidv4';

import ITeamsRepository from '../ITeamsRepository';

class FakeTeamsRepository implements ITeamsRepository {
  private teams: Team[] = [];

  public async findById(id: string): Promise<Team | undefined> {
    const teamFound = this.teams.find(team => team.id === id);
    return teamFound;
  }

  public async findByUgr(
    ugr_id: string,
    exclude: boolean,
  ): Promise<Team[] | undefined> {
    const teamFound = this.teams.map(team => {
      if (team.enabled === exclude) {
        return team;
      }
      return team;
    });
    return teamFound;
  }

  public async findByContractor(
    contractor_id: string,
  ): Promise<Team | undefined> {
    const teamFound = this.teams.find(
      team => team.contractor_id === contractor_id,
    );
    return teamFound;
  }

  public async create(teamData: ICreateTeamDTO): Promise<Team> {
    const team = new Team();
    Object.assign(team, { id: uuid() }, teamData);

    this.teams.push(team);

    return team;
  }

  public async remove(team: Team): Promise<void> {
    const findIndexTeam = this.teams.findIndex(
      findTeam => findTeam.id === team.id,
    );

    this.teams.splice(findIndexTeam, 1);
  }

  public async save(team: Team): Promise<Team> {
    const findIndex = this.teams.findIndex(findTeam => findTeam.id === team.id);
    this.teams[findIndex] = team;
    return team;
  }
}

export default FakeTeamsRepository;
