import CreateTeamService from '@modules/teams/services/CreateTeamService';
import FindTeamService from '@modules/teams/services/FindTeamService';
import ListFilteredTeamService from '@modules/teams/services/ListFilteredTeamService';
import ListTeamService from '@modules/teams/services/ListTeamService';
import UpdateTeamService from '@modules/teams/services/UpdateTeamService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class TeamsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      page = 1,
      limit = 10,
      exclude = false,
      ugr_id = '',
    } = request.query;

    if (ugr_id) {
      const listFilteredTeams = container.resolve(ListFilteredTeamService);

      const teams = await listFilteredTeams.execute({
        ugr_id: ugr_id as string,
        exclude: exclude as boolean,
      });
      return response.json(teams);
    }

    const listTeams = container.resolve(ListTeamService);

    const teams = await listTeams.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/teams`,
      },
      entity: 'Team',
      exclude: exclude as boolean,
    });

    return response.json(teams);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, contractor_id, enabled } = request.body;

    const createTeam = container.resolve(CreateTeamService);

    const team = await createTeam.execute({
      name,
      contractor_id,
      enabled,
    });

    return response.json(team);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: team_id } = request.params;
    const { name, contractor_id, enabled } = request.body;

    const updateTeam = container.resolve(UpdateTeamService);

    const team = await updateTeam.execute({
      team_id,
      name,
      contractor_id,
      enabled,
    });

    return response.json(team);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: team_id } = request.params;

    const findTeam = container.resolve(FindTeamService);

    const team = await findTeam.execute({
      team_id,
    });

    return response.json(team);
  }
}
