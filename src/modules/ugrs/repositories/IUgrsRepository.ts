import ICreateUgrDTO from '../dtos/ICreateUgrDTO';
import Ugr from '../infra/typeorm/entities/Ugr';

export default interface IUgrsRepository {
  findById(id: string): Promise<Ugr | undefined>;
  create(data: ICreateUgrDTO): Promise<Ugr>;
  remove(ugr: Ugr): Promise<void>;
  save(ugr: Ugr): Promise<Ugr>;
}
