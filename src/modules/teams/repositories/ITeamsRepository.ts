import ICreateTeamDTO from '../dtos/ICreateTeamDTO';
import Team from '../infra/typeorm/entities/Team';

export default interface ITeamsRepository {
  findById(id: string): Promise<Team | undefined>;
  findByContractor(contractor_id: string): Promise<Team | undefined>;
  findByUgr(ugr_id: string, exclude: boolean): Promise<Team[] | undefined>;
  create(data: ICreateTeamDTO): Promise<Team>;
  remove(contract: Team): Promise<void>;
  save(contract: Team): Promise<Team>;
}
