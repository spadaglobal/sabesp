import Lv from '@modules/lvs/infra/typeorm/entities/Lv';
import ReviewsRequirements from '@modules/reviews/infra/typeorm/entities/ReviewsRequirements';
import TaskType from '@modules/tasks/infra/typeorm/entities/TaskType';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Generated,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity('requirements')
class Requirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  @Generated('uuid')
  parent_id: string;

  @Column()
  @Generated('uuid')
  requirementsId: string;

  @ManyToMany(() => TaskType, taskType => taskType.requirements, {
    cascade: true,
  })
  @JoinTable({
    name: 'requirements_task_types_task_types',
    joinColumn: {
      name: 'requirementsId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'taskTypesId',
      referencedColumnName: 'id',
    },
  })
  taskTypes: TaskType[];

  @ManyToOne(() => Requirement, requirement => requirement.children)
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent: Requirement;

  @ManyToOne(() => Requirement, requirement => requirement.grandchilds)
  @JoinColumn({ name: 'requirementsId', referencedColumnName: 'id' })
  firstParent: Requirement;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Lv)
  @JoinTable({
    name: 'requirements_lvs_lvs',
    joinColumn: {
      name: 'requirementsId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'lvsId',
      referencedColumnName: 'id',
    },
  })
  lvs: Lv[];

  @OneToMany(() => Requirement, requirement => requirement.parent)
  children: Requirement[];

  @OneToMany(() => Requirement, requirement => requirement.firstParent)
  grandchilds: Requirement[];

  @OneToMany(
    () => ReviewsRequirements,
    reviewsToRequirements => reviewsToRequirements.requirement,
  )
  reviewsToRequirements: ReviewsRequirements[];
}

export default Requirement;
