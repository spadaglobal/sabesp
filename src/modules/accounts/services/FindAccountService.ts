import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Account from '../infra/typeorm/entities/Account';
import IAccountsRepository from '../repositories/IAccountsRepository';

interface IRequest {
  account_id: string;
}

@injectable()
class FindAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) {}

  public async execute({ account_id }: IRequest): Promise<Account> {
    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new AppError('Account not found!');
    }

    return account;
  }
}

export default FindAccountService;
