import ICreateAccountDTO from '../dtos/ICreateAccountDTO';
import Account from '../infra/typeorm/entities/Account';

export default interface IAccountsRepository {
  findById(id: string): Promise<Account | undefined>;
  findByCode(code: string): Promise<Account | undefined>;
  create(data: ICreateAccountDTO): Promise<Account>;
  remove(account: Account): Promise<void>;
  save(account: Account): Promise<Account>;
}
