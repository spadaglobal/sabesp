import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Contractor from './Contractor';
import Group from './Group';

@Entity('ugrs')
class Ugr {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Group, group => group.ugr)
  groups: Group;

  @ManyToMany(() => Contractor)
  @JoinTable({
    name: 'contractors_ugrs_ugrs',
    joinColumn: {
      name: 'ugrsId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'contractorsId',
      referencedColumnName: 'id',
    },
  })
  contractors: Contractor[];
}

export default Ugr;
