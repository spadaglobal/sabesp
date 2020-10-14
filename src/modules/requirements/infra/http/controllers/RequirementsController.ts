import CreateRequirementService from '@modules/requirements/services/CreateRequirementService';
import DeleteRequirementService from '@modules/requirements/services/DeleteRequirementService';
import FindRequirementService from '@modules/requirements/services/FindRequirementService';
import ListRequirementService from '@modules/requirements/services/ListRequirementService';
import UpdateRequirementService from '@modules/requirements/services/UpdateRequirementService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class RequirementsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 999, parent_id = '', lv_id = '' } = request.query;

    const listRequirements = container.resolve(ListRequirementService);

    const requirements = await listRequirements.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/requirements`,
      },
      entity: 'Requirement',
      parent_id: parent_id as string,
      lv_id: lv_id as string,
    });

    return response.json(requirements);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { title, task_type_ids, parent_id } = request.body;

    const createRequirement = container.resolve(CreateRequirementService);

    const requirement = await createRequirement.execute({
      title,
      task_type_ids,
      parent_id,
    });

    return response.json(requirement);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { title, task_type_ids, parent_id } = request.body;
    const { id: requirement_id } = request.params;

    const updateRequirement = container.resolve(UpdateRequirementService);

    const requirement = await updateRequirement.execute({
      requirement_id,
      title,
      task_type_ids,
      parent_id,
    });

    return response.json(requirement);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: requirement_id } = request.params;

    const findRequirement = container.resolve(FindRequirementService);

    const requirement = await findRequirement.execute({
      requirement_id,
    });

    return response.json(requirement);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: requirement_id } = request.params;

    const deleteRequirement = container.resolve(DeleteRequirementService);

    await deleteRequirement.execute({
      requirement_id,
    });

    return response.status(204).json();
  }
}
