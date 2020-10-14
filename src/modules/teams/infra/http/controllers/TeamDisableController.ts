import DisableTeamService from '@modules/teams/services/DisableTeamService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class TeamDisableController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id: team_id } = request.params;

    const disableTeam = container.resolve(DisableTeamService);

    await disableTeam.execute({ team_id });

    return response.status(204).json();
  }
}
