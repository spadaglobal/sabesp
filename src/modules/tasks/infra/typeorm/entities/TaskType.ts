import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('task_types')
class TaskType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Requirement)
  @JoinTable({
    name: 'requirements_task_types_task_types',
    joinColumn: {
      name: 'taskTypesId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'requirementsId',
      referencedColumnName: 'id',
    },
  })
  requirements: Requirement[];
}

export default TaskType;
