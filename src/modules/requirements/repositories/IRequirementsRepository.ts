import ICreateRequirementDTO from '../dtos/ICreateRequirementDTO';
import Requirement from '../infra/typeorm/entities/Requirement';

export default interface IRequirementsRepository {
  findByTitle(title: string): Promise<Requirement | undefined>;
  findByTaskType(
    task_type_id: string | null,
  ): Promise<Requirement[] | undefined>;
  findById(id: string): Promise<Requirement | undefined>;
  create(data: ICreateRequirementDTO): Promise<Requirement>;
  remove(requirement: Requirement): Promise<void>;
  save(requirement: Requirement): Promise<Requirement>;
}
