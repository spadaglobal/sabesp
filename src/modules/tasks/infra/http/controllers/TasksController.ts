import CreateTaskService from '@modules/tasks/services/CreateTaskService';
import FindTaskService from '@modules/tasks/services/FindTaskService';
import ListFilteredTaskService from '@modules/tasks/services/ListFilteredTaskService';
import ListTaskService from '@modules/tasks/services/ListTaskService';
import UpdateTaskService from '@modules/tasks/services/UpdateTaskService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class TasksController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      page = 1,
      limit = 10,
      exclude = false,
      name = '',
      type = '',
    } = request.query;

    if (name || type) {
      const listTasks = container.resolve(ListFilteredTaskService);

      const tasks = await listTasks.execute({
        options: {
          page: page as number,
          limit: limit as number,
          route: `${process.env.APP_API_URL}/tasks`,
        },
        entity: 'Task',
        exclude: exclude as boolean,
        name: name as string,
        type: type as string,
      });

      return response.json(tasks);
    }
    const listTasks = container.resolve(ListTaskService);

    const tasks = await listTasks.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/tasks`,
      },
      entity: 'Task',
      exclude: exclude as boolean,
    });

    return response.json(tasks);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { description, type, enabled } = request.body;

    const createTask = container.resolve(CreateTaskService);

    const task = await createTask.execute({
      description,
      enabled,
      type,
    });

    return response.json(task);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { description, type, enabled } = request.body;
    const { id: task_id } = request.params;

    const updateTask = container.resolve(UpdateTaskService);

    const task = await updateTask.execute({
      task_id,
      description,
      enabled,
      type,
    });

    return response.json(task);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: task_id } = request.params;

    const findTask = container.resolve(FindTaskService);

    const task = await findTask.execute({
      task_id,
    });

    return response.json(task);
  }
}
