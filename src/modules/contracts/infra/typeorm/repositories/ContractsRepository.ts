import ICreateContractDTO from '@modules/contracts/dtos/ICreateContractDTO';
import IContractsRepository from '@modules/contracts/repositories/IContractsRepository';
import { Repository, getRepository } from 'typeorm';

import Contract from '../entities/Contract';

class ContractsRepository implements IContractsRepository {
  private ormRepository: Repository<Contract>;

  constructor() {
    this.ormRepository = getRepository(Contract);
  }

  public async findById(id: string): Promise<Contract | undefined> {
    const contract = await this.ormRepository.findOne(id);
    return contract;
  }

  public async findByTitle(title: string): Promise<Contract | undefined> {
    const contract = await this.ormRepository.findOne({ title });
    return contract;
  }

  public async create(contractData: ICreateContractDTO): Promise<Contract> {
    const contract = this.ormRepository.create(contractData);
    await this.ormRepository.save(contract);
    return contract;
  }

  public async remove(contract: Contract): Promise<void> {
    await this.ormRepository.delete(contract);
  }

  public async save(contract: Contract): Promise<Contract> {
    return this.ormRepository.save(contract);
  }
}

export default ContractsRepository;
