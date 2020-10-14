import ICreateContractorDTO from '@modules/ugrs/dtos/ICreateContractorDTO';
import IContractorsRepository from '@modules/ugrs/repositories/IContactorsRepository';
import { Repository, getRepository } from 'typeorm';

import Contractor from '../entities/Contractor';

class ContractorsRepository implements IContractorsRepository {
  private ormRepository: Repository<Contractor>;

  constructor() {
    this.ormRepository = getRepository(Contractor);
  }

  public async findById(id: string): Promise<Contractor | undefined> {
    const contractor = await this.ormRepository.findOne(id, {
      relations: ['ugrs', 'contract'],
    });
    return contractor;
  }

  public async findByContractNumber(
    contractNumber: string,
  ): Promise<Contractor | undefined> {
    const contractor = await this.ormRepository.findOne({
      contract_number: contractNumber,
    });
    return contractor;
  }

  public async findByContract(
    contract_id: string,
  ): Promise<Contractor | undefined> {
    const contractor = await this.ormRepository.findOne({ contract_id });
    return contractor;
  }

  public async create(
    contractorData: ICreateContractorDTO,
  ): Promise<Contractor> {
    const contractor = this.ormRepository.create(contractorData);
    await this.ormRepository.save(contractor);
    return contractor;
  }

  public async remove(contractor: Contractor): Promise<void> {
    await this.ormRepository.delete(contractor);
  }

  public async save(contractor: Contractor): Promise<Contractor> {
    return this.ormRepository.save(contractor);
  }
}

export default ContractorsRepository;
