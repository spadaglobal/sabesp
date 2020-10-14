import ICreateRequirementDTO from '@modules/requirements/dtos/ICreateRequirementDTO';
import IRequirementsRepository from '@modules/requirements/repositories/IRequirementsRepository';
import { Repository, getRepository } from 'typeorm';

import Requirement from '../entities/Requirement';

class RequirementsRepository implements IRequirementsRepository {
  private ormRepository: Repository<Requirement>;

  constructor() {
    this.ormRepository = getRepository(Requirement);
  }

  public async findById(id: string): Promise<Requirement | undefined> {
    const requirement = await this.ormRepository.findOne(id);
    return requirement;
  }

  public async findByTitle(title: string): Promise<Requirement | undefined> {
    const requirement = await this.ormRepository.findOne({ title });
    return requirement;
  }

  public async findByTaskType(
    task_type_id: string | null,
  ): Promise<Requirement[] | undefined> {
    if (task_type_id) {
      const requirements = await this.ormRepository
        .createQueryBuilder('requirements')
        .innerJoin('requirements.taskTypes', 'types', 'types.id = :id', {
          id: task_type_id,
        })
        .getMany();
      return requirements;
    }
    const requirements = await this.ormRepository.find({
      where: {
        parent_id: null,
      },
    });
    return requirements;
  }

  public async create(
    requirementData: ICreateRequirementDTO,
  ): Promise<Requirement> {
    const requirement = this.ormRepository.create(requirementData);
    await this.ormRepository.save(requirement);
    return requirement;
  }

  public async remove(requirement: Requirement): Promise<void> {
    await this.ormRepository.delete(requirement);
  }

  public async save(requirement: Requirement): Promise<Requirement> {
    return this.ormRepository.save(requirement);
  }
}

export default RequirementsRepository;
