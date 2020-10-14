import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
import TaskType from '@modules/tasks/infra/typeorm/entities/TaskType';
import ITaskTypesRepository from '@modules/tasks/repositories/ITaskTypesRepository';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IRequirementsRepository from '../repositories/IRequirementsRepository';

interface IRequest {
  title: string;
  task_type_ids?: string[];
  parent_id?: string;
  type?: string;
}

@injectable()
class CreateRequirementService {
  constructor(
    @inject('RequirementsRepository')
    private requirementsRepository: IRequirementsRepository,
    @inject('TaskTypesRepository')
    private taskTypesRepository: ITaskTypesRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    title,
    task_type_ids,
    parent_id,
    type,
  }: IRequest): Promise<Requirement> {
    const checkRequimentExists = await this.requirementsRepository.findByTitle(
      title,
    );

    if (checkRequimentExists) {
      throw new AppError('Requirement already exists');
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
    }

    const requirement = await this.requirementsRepository.create({
      title,
      taskTypes,
      parent_id,
      type,
    });

    await this.cacheProvider.invalidatePrefix('requirements-list');

    return requirement;
  }
}

export default CreateRequirementService;
