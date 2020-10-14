import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
import Group from '@modules/ugrs/infra/typeorm/entities/Group';
import Ugr from '@modules/ugrs/infra/typeorm/entities/Ugr';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('lvs')
class Lv {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  contract_id: string;

  @Column()
  date_start: Date;

  @Column()
  date_end: Date;

  @Column()
  time_start: Date;

  @Column()
  time_end: Date;

  @Column()
  @Generated('uuid')
  task_start_id: string;

  @Column()
  @Generated('uuid')
  task_end_id: string;

  @Column()
  @Generated('uuid')
  task_type_id: string;

  @Column()
  @Generated('uuid')
  ugr_id: string;

  @Column()
  @Generated('uuid')
  group_id: string;

  @Column()
  address: string;

  @Column()
  location: string;

  @Column()
  @Generated('uuid')
  team_id: string;

  @Column()
  @Generated('uuid')
  order_id: string;

  @Column()
  no_order: string;

  @Column()
  @Generated('uuid')
  contractor_id: string;

  @Column()
  @Generated('increment')
  tag: number;

  @Column()
  observation_first: string;

  @Column()
  observation_second: string;

  @Column()
  observation_third: string;

  @Column()
  observation_fourth: string;

  @Column()
  @Generated('uuid')
  user_id: string;

  @ManyToMany(() => Requirement)
  @JoinTable({
    name: 'requirements_lvs_lvs',
    joinColumn: {
      name: 'lvsId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'requirementsId',
      referencedColumnName: 'id',
    },
  })
  requirements: Requirement[];

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group: Group;

  @ManyToOne(() => Ugr)
  @JoinColumn({ name: 'ugr_id', referencedColumnName: 'id' })
  ugr: Ugr;
}

export default Lv;
