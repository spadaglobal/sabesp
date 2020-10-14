import ICreateLvPosDTO from '../dtos/ICreateLvPosDTO';
import LvPos from '../infra/typeorm/entities/LvPos';

export default interface ILvPosRepository {
  findById(id: string): Promise<LvPos | undefined>;
  create(data: ICreateLvPosDTO): Promise<LvPos>;
  remove(lv_id: string): Promise<void>;
  save(lv: LvPos): Promise<LvPos>;
}
