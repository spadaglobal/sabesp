import ICreateAccountDTO from '@modules/accounts/dtos/ICreateAccountDTO';
import IAccountsRepository from '@modules/accounts/repositories/IAccountsRepository';
import { Repository, getRepository } from 'typeorm';

import Account from '../entities/Account';

class AccountsRepository implements IAccountsRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  public async findById(id: string): Promise<Account | undefined> {
    const account = await this.ormRepository.findOne(id);
    return account;
  }

  public async findByCode(code: string): Promise<Account | undefined> {
    const account = await this.ormRepository.findOne({ code });
    return account;
  }

  public async create(accountData: ICreateAccountDTO): Promise<Account> {
    const account = this.ormRepository.create(accountData);
    await this.ormRepository.save(account);
    return account;
  }

  public async remove(account: Account): Promise<void> {
    await this.ormRepository.delete(account);
  }

  public async save(account: Account): Promise<Account> {
    return this.ormRepository.save(account);
  }
}

export default AccountsRepository;
