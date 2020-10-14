import ICreateReasonDTO from '../dtos/ICreateReasonDTO';
import Reason from '../infra/typeorm/entities/Reason';

export default interface IReasonsRepository {
  findById(id: string): Promise<Reason | undefined>;
  create(data: ICreateReasonDTO): Promise<Reason>;
  remove(reason_id: string): Promise<void>;
  save(reason: Reason): Promise<Reason>;
}
