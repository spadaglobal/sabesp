import ICreateTeamDTO from '@modules/teams/dtos/ICreateTeamDTO';
import ITeamsRepository from '@modules/teams/repositories/ITeamsRepository';
import { Repository, getRepository } from 'typeorm';

import Team from '../entities/Team';

class TeamsRepository implements ITeamsRepository {
  private ormRepository: Repository<Team>;

  constructor() {
    this.ormRepository = getRepository(Team);
  }

  public async findById(id: string): Promise<Team | undefined> {
    const team = await this.ormRepository.findOne(id, {
      relations: ['contractor'],
    });
    return team;
  }

  public async findByUgr(
    ugr_id: string,
    exclude: boolean,
  ): Promise<Team[] | undefined> {
    let teams: Team[] | undefined = [];
    if (exclude) {
      teams = await this.ormRepository.query(
        `select teams.*, contractors.name as contractor_name, contractors.contract_id from teams inner join contractors on contractors.id = teams.contractor_id where teams.contractor_id in (select contractors_ugrs_ugrs."contractorsId" from contractors_ugrs_ugrs where contractors_ugrs_ugrs."contractorsId" = contractors.id and contractors_ugrs_ugrs."ugrsId" = '${ugr_id}' and teams.enabled = ${exclude})`,
      );
    } else {
      teams = await this.ormRepository.query(
        `select teams.*, contractors.name as contractor_name, contractors.contract_id from teams inner join contractors on contractors.id = teams.contractor_id where teams.contractor_id in (select contractors_ugrs_ugrs."contractorsId" from contractors_ugrs_ugrs where contractors_ugrs_ugrs."contractorsId" = contractors.id and contractors_ugrs_ugrs."ugrsId" = '${ugr_id}')`,
      );
    }
    return teams;
  }

  public async findByContractor(
    contractor_id: string,
  ): Promise<Team | undefined> {
    const team = await this.ormRepository.findOne({ contractor_id });
    return team;
  }

  public async create(teamData: ICreateTeamDTO): Promise<Team> {
    const team = this.ormRepository.create(teamData);
    await this.ormRepository.save(team);
    return team;
  }

  public async remove(team: Team): Promise<void> {
    await this.ormRepository.delete(team);
  }

  public async save(team: Team): Promise<Team> {
    return this.ormRepository.save(team);
  }
}

export default TeamsRepository;
