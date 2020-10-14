import ICreateContractorDTO from '@modules/ugrs/dtos/ICreateContractorDTO';
import Contractor from '@modules/ugrs/infra/typeorm/entities/Contractor';

export default interface IContractorsRepository {
  findById(id: string): Promise<Contractor | undefined>;
  findByContractNumber(contractNumber: string): Promise<Contractor | undefined>;
  findByContract(contract_id: string): Promise<Contractor | undefined>;
  create(data: ICreateContractorDTO): Promise<Contractor>;
  remove(contractor: Contractor): Promise<void>;
  save(contractor: Contractor): Promise<Contractor>;
}
