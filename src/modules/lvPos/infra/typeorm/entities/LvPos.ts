import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('lvPos')
class LvPos {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  contract_id: string;

  @Column()
  date: Date;

  @Column()
  time: Date;

  @Column()
  @Generated('uuid')
  task_start_id: string;

  @Column()
  @Generated('uuid')
  task_end_id: string;

  @Column()
  @Generated('uuid')
  ugr_id: string;

  @Column()
  @Generated('uuid')
  group_id: string;

  @Column()
  address: string;

  @Column()
  @Generated('uuid')
  contractor_id: string;

  @Column()
  observation_first: string;

  @Column()
  observation_second: string;

  @Column()
  observation_third: string;

  @Column()
  observation_fourth: string;

  @Column()
  badge_solo: string;

  @Column()
  badge_capa: string;

  @Column()
  location: string;

  @Column()
  @Generated('uuid')
  user_id: string;

  @Column()
  @Generated('uuid')
  lv_id: string;

  @Column()
  status: string;

  @ManyToMany(() => Requirement)
  @JoinTable({
    name: 'requirements_lv_pos_lv_pos',
    joinColumn: {
      name: 'lvPos',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'requirements',
      referencedColumnName: 'id',
    },
  })
  requirements: Requirement[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default LvPos;
