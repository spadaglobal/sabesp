import DisableTaskService from '@modules/tasks/services/DisableTaskService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class TaskDisableController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const disableTask = container.resolve(DisableTaskService);

    await disableTask.execute({ task_id: id });

    return response.status(204).json();
  }
}
