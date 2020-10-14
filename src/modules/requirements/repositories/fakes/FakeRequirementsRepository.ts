import ICreateRequirementDTO from '@modules/requirements/dtos/ICreateRequirementDTO';
import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
import { uuid } from 'uuidv4';

import IRequirementsRepository from '../IRequirementsRepository';

class FakeRequirementsRepository implements IRequirementsRepository {
  private requirements: Requirement[] = [];

  public async findById(id: string): Promise<Requirement | undefined> {
    const requirementFound = this.requirements.find(
      requirement => requirement.id === id,
    );
    return requirementFound;
  }

  public async findByTitle(title: string): Promise<Requirement | undefined> {
    const requirementFound = this.requirements.find(
      requirement => requirement.title === title,
    );
    return requirementFound;
  }

  public async findByTaskType(
    task_type_id: string | null,
  ): Promise<Requirement[] | undefined> {
    const requirementFound = this.requirements.filter(requirement => {
      let match = false;
      // eslint-disable-next-line consistent-return
      requirement.taskTypes.forEach(taskType => {
        if (taskType.id === task_type_id) {
          match = true;
        }
      });
      return match;
    });
    return requirementFound.length === 0 ? undefined : requirementFound;
  }

  public async create(
    requirementData: ICreateRequirementDTO,
  ): Promise<Requirement> {
    const requirement = new Requirement();
    Object.assign(requirement, { id: uuid() }, requirementData);

    this.requirements.push(requirement);

    return requirement;
  }

  public async remove(requirement: Requirement): Promise<void> {
    const findIndexRequirement = this.requirements.findIndex(
      findRequirement => findRequirement.id === requirement.id,
    );

    this.requirements.splice(findIndexRequirement, 1);
  }

  public async save(requirement: Requirement): Promise<Requirement> {
    const findIndex = this.requirements.findIndex(
      findRequirement => findRequirement.id === requirement.id,
    );
    this.requirements[findIndex] = requirement;
    return requirement;
  }
}

export default FakeRequirementsRepository;
