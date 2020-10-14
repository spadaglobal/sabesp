import ICreateLvDTO from '../dtos/ICreateLvDTO';
import Lv from '../infra/typeorm/entities/Lv';

export default interface ILvsRepository {
  findById(id: string): Promise<Lv | undefined>;
  create(data: ICreateLvDTO): Promise<Lv>;
  remove(lv_id: string): Promise<void>;
  save(lv: Lv): Promise<Lv>;
}
