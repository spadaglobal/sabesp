import Contract from '@modules/contracts/infra/typeorm/entities/Contract';
import Team from '@modules/teams/infra/typeorm/entities/Team';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Ugr from './Ugr';

@Entity('contractors')
class Contractor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contract_number: string;

  @Column()
  name: string;

  @Column()
  @Generated('uuid')
  contract_id: string;

  @Column()
  prefix: string;

  @Column({ default: true })
  enabled: boolean;

  @ManyToMany(() => Ugr)
  @JoinTable()
  ugrs: Ugr[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Contract)
  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  contract: Contract;

  @OneToMany(() => Team, team => team.contractor)
  teams: Team[];
}

export default Contractor;
