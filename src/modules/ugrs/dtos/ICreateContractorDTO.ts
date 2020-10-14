import Ugr from '@modules/ugrs/infra/typeorm/entities/Ugr';

export default interface ICreateContractorDTO {
  contract_number: string;
  name: string;
  contract_id: string;
  prefix: string;
  enabled?: boolean;
  ugrs?: Ugr[];
}
