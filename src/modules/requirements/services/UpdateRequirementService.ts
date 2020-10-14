import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
import TaskType from '@modules/tasks/infra/typeorm/entities/TaskType';
import ITaskTypesRepository from '@modules/tasks/repositories/ITaskTypesRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IRequirementsRepository from '../repositories/IRequirementsRepository';

interface IRequest {
  requirement_id: string;
  title: string;
  task_type_ids?: string[];
  parent_id?: string;
  type?: string;
  status?: string;
}

@injectable()
class UpdateRequirementService {
  constructor(
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    requirement_id,
    title,
    task_type_ids,
    parent_id,
    type,
  }: IRequest): Promise<Requirement> {
    const requirement = await this.requirementsRepository.findById(
      requirement_id,
    );

    if (!requirement) {
      throw new AppError('Requirement not found');
    }

    const checkRequimentExists = await this.requirementsRepository.findByTitle(
      title,
    );

    if (checkRequimentExists) {
      if (checkRequimentExists.id !== requirement.id) {
        throw new AppError('Requirement already exists');
      }
    }

    const taskTypes: TaskType[] = [];
    if (task_type_ids) {
      await Promise.all(
        task_type_ids.map(async task_type_id => {
          const checkTaskTypeExists = await this.taskTypesRepository.findById(
            task_type_id,
          );
          if (!checkTaskTypeExists) {
            throw new AppError('Task Type not found');
          }
          taskTypes.push(checkTaskTypeExists);
        }),
      );
    }

    if (parent_id) {
      const checkParentRequirementExists = await this.requirementsRepository.findById(
        parent_id,
      );
      if (!checkParentRequirementExists) {
        throw new AppError('This parent not exists');
      }
      requirement.parent_id = parent_id;
    }

    if (type) {
      requirement.type = type;
    }

    requirement.title = title;

    requirement.taskTypes = taskTypes;

    await this.requirementsRepository.save(requirement);

    await this.cacheProvider.invalidatePrefix('requirements-list');

    return requirement;
  }
}

export default UpdateRequirementService;
