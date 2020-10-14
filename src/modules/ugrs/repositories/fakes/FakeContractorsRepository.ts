import ICreateContractorDTO from '@modules/ugrs/dtos/ICreateContractorDTO';
import Contractor from '@modules/ugrs/infra/typeorm/entities/Contractor';
import { uuid } from 'uuidv4';

import IContractorsRepository from '../IContactorsRepository';

class FakeContractorsRepository implements IContractorsRepository {
  private contractors: Contractor[] = [];

  public async findById(id: string): Promise<Contractor | undefined> {
    const contractorFound = this.contractors.find(
      contractor => contractor.id === id,
    );
    return contractorFound;
  }

  public async findByContract(
    contract_id: string,
  ): Promise<Contractor | undefined> {
    const contractorFound = this.contractors.find(
      contractor => contractor.contract_id === contract_id,
    );
    return contractorFound;
  }

  public async findByContractNumber(
    contractNumber: string,
  ): Promise<Contractor | undefined> {
    const contractorFound = this.contractors.find(
      contractor => contractor.contract_number === contractNumber,
    );
    return contractorFound;
  }

  public async create(
    contractorData: ICreateContractorDTO,
  ): Promise<Contractor> {
    const contractor = new Contractor();
    Object.assign(contractor, { id: uuid() }, contractorData);

    this.contractors.push(contractor);

    return contractor;
  }

  public async remove(contractor: Contractor): Promise<void> {
    const findIndexContractor = this.contractors.findIndex(
      findContractor => findContractor.id === contractor.id,
    );

    this.contractors.splice(findIndexContractor, 1);
  }

  public async save(contractor: Contractor): Promise<Contractor> {
    const findIndex = this.contractors.findIndex(
      findContractor => findContractor.id === contractor.id,
    );
    this.contractors[findIndex] = contractor;
    return contractor;
  }
}

export default FakeContractorsRepository;
