import ICreateContractDTO from '../dtos/ICreateContractDTO';
import Contract from '../infra/typeorm/entities/Contract';

export default interface IContractsRepository {
  findById(id: string): Promise<Contract | undefined>;
  findByTitle(title: string): Promise<Contract | undefined>;
  create(data: ICreateContractDTO): Promise<Contract>;
  remove(contract: Contract): Promise<void>;
  save(contract: Contract): Promise<Contract>;
}
