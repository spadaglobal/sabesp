import ICreateReasonDTO from '@modules/reasons/dtos/ICreateReasonDTO';
import Reason from '@modules/reasons/infra/typeorm/entities/Reason';
import { uuid } from 'uuidv4';

import IReasonsRepository from '../IReasonsRepository';

class FakeReasonsRepository implements IReasonsRepository {
  private reasons: Reason[] = [];

  public async findById(id: string): Promise<Reason | undefined> {
    const reasonFound = this.reasons.find(reason => reason.id === id);
    return reasonFound;
  }

  public async create(reasonData: ICreateReasonDTO): Promise<Reason> {
    const reason = new Reason();
    Object.assign(reason, { id: uuid() }, reasonData);

    this.reasons.push(reason);

    return reason;
  }

  public async remove(reason_id: string): Promise<void> {
    const findIndexReason = this.reasons.findIndex(
      findReason => findReason.id === reason_id,
    );

    this.reasons.splice(findIndexReason, 1);
  }

  public async save(reason: Reason): Promise<Reason> {
    const findIndex = this.reasons.findIndex(
      findReason => findReason.id === reason.id,
    );
    this.reasons[findIndex] = reason;
    return reason;
  }
}

export default FakeReasonsRepository;
