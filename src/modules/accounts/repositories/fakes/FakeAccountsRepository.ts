import ICreateAccountDTO from '@modules/accounts/dtos/ICreateAccountDTO';
import Account from '@modules/accounts/infra/typeorm/entities/Account';
import { uuid } from 'uuidv4';

import IAccountsRepository from '../IAccountsRepository';

class FakeAccountsRepository implements IAccountsRepository {
  private accounts: Account[] = [];

  public async findById(id: string): Promise<Account | undefined> {
    const accountFound = this.accounts.find(account => account.id === id);
    return accountFound;
  }

  public async findByCode(code: string): Promise<Account | undefined> {
    const accountFound = this.accounts.find(account => account.code === code);
    return accountFound;
  }

  public async create(accountData: ICreateAccountDTO): Promise<Account> {
    const account = new Account();
    Object.assign(account, { id: uuid() }, accountData);

    this.accounts.push(account);

    return account;
  }

  public async remove(account: Account): Promise<void> {
    const findIndexAccount = this.accounts.findIndex(
      findAccount => findAccount.id === account.id,
    );

    this.accounts.splice(findIndexAccount, 1);
  }

  public async save(account: Account): Promise<Account> {
    const findIndex = this.accounts.findIndex(
      findAccount => findAccount.id === account.id,
    );
    this.accounts[findIndex] = account;
    return account;
  }
}

export default FakeAccountsRepository;
