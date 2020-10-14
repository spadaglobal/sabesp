import CreateAccountService from '@modules/accounts/services/CreateAccountService';
import DeleteAccountService from '@modules/accounts/services/DeleteAccountService';
import FindAccountService from '@modules/accounts/services/FindAccountService';
import ListAccountService from '@modules/accounts/services/ListAccountService';
import UpdateAccountService from '@modules/accounts/services/UpdateAccountService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AccountsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, exclude = false } = request.query;

    const listAccounts = container.resolve(ListAccountService);

    const accounts = await listAccounts.execute({
      options: {
        page: page as number,
        limit: limit as number,
        route: `${process.env.APP_API_URL}/accounts`,
      },
      entity: 'Account',
      exclude: exclude as boolean,
    });

    return response.json(accounts);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { type, task_type_id, code, tasks_ids, group_id } = request.body;

    const createAccount = container.resolve(CreateAccountService);

    const account = await createAccount.execute({
      type,
      task_type_id,
      code,
      tasks_ids,
      group_id,
    });

    return response.json(account);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: account_id } = request.params;
    const { type, task_type_id, code, tasks_ids, group_id } = request.body;

    const updateAccount = container.resolve(UpdateAccountService);

    const account = await updateAccount.execute({
      account_id,
      type,
      task_type_id,
      code,
      tasks_ids,
      group_id,
    });

    return response.json(account);
  }

  public async edit(request: Request, response: Response): Promise<Response> {
    const { id: account_id } = request.params;

    const findAccount = container.resolve(FindAccountService);

    const account = await findAccount.execute({
      account_id,
    });

    return response.json(account);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id: account_id } = request.params;

    const deleteAccount = container.resolve(DeleteAccountService);

    await deleteAccount.execute({
      account_id,
    });

    return response.status(204).json();
  }
}
