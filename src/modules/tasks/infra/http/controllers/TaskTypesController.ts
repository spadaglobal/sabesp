import CreateTaskTypeService from '@modules/tasks/services/CreateTaskTypeService';
import DeleteTaskTypeService from '@modules/tasks/services/DeleteTaskTypeService';
import FindTaskTypeService from '@modules/tasks/services/FindTaskTypeService';
import ListTaskTypeService from '@modules/tasks/services/ListTaskTypeService';
import UpdateTaskTypeService from '@modules/tasks/services/UpdateTaskTypeService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class TaskTypesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10 } = request.query;

    const listTaskTypes = container.resolve(ListTaskTypeService);

    const taskTypes = await listTaskTypes.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/task-types`,
      },
      entity: 'TaskType',
    });

    return response.json(taskTypes);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description } = request.body;

    const createTaskType = container.resolve(CreateTaskTypeService);

    const taskType = await createTaskType.execute({
      description,
    });

    return response.json(taskType);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { description } = request.body;
    const { id: task_type_id } = request.params;

    const updateTaskType = container.resolve(UpdateTaskTypeService);

    const taskType = await updateTaskType.execute({
      description,
      task_type_id,
    });

    return response.json(taskType);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: task_type_id } = request.params;

    const findTaskType = container.resolve(FindTaskTypeService);

    const taskType = await findTaskType.execute({
      task_type_id,
    });

    return response.json(taskType);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: task_type_id } = request.params;

    const deleteTaskType = container.resolve(DeleteTaskTypeService);

    await deleteTaskType.execute({
      task_type_id,
    });

    return response.status(204).json();
  }
}
