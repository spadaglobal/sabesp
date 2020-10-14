import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IAccountsRepository from '../repositories/IAccountsRepository';

interface IRequest {
  account_id: string;
}

@injectable()
class DeleteAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ account_id }: IRequest): Promise<void> {
    const account = await this.accountsRepository.findById(account_id);

    if (!account) {
      throw new AppError('Order not found!');
    }

    await this.cacheProvider.invalidatePrefix('orders-list');

    await this.accountsRepository.remove(account);
  }
}

export default DeleteAccountService;
