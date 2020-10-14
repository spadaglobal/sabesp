import ICreateContractDTO from '@modules/contracts/dtos/ICreateContractDTO';
import Contract from '@modules/contracts/infra/typeorm/entities/Contract';
import { uuid } from 'uuidv4';

import IContractsRepository from '../IContractsRepository';

class FakeContractsRepository implements IContractsRepository {
  private contracts: Contract[] = [];

  public async findById(id: string): Promise<Contract | undefined> {
    const contractFound = this.contracts.find(contract => contract.id === id);
    return contractFound;
  }

  public async findByTitle(title: string): Promise<Contract | undefined> {
    const contractFound = this.contracts.find(
      contract => contract.title === title,
    );
    return contractFound;
  }

  public async create(contractData: ICreateContractDTO): Promise<Contract> {
    const contract = new Contract();
    Object.assign(contract, { id: uuid() }, contractData);

    this.contracts.push(contract);

    return contract;
  }

  public async remove(contract: Contract): Promise<void> {
    const findIndexContract = this.contracts.findIndex(
      findContract => findContract.id === contract.id,
    );

    this.contracts.splice(findIndexContract, 1);
  }

  public async save(contract: Contract): Promise<Contract> {
    const findIndex = this.contracts.findIndex(
      findContract => findContract.id === contract.id,
    );
    this.contracts[findIndex] = contract;
    return contract;
  }
}

export default FakeContractsRepository;
