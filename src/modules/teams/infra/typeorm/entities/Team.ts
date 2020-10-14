import Contractor from '@modules/ugrs/infra/typeorm/entities/Contractor';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('teams')
class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Generated('uuid')
  contractor_id: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Contractor)
  @JoinColumn({ name: 'contractor_id', referencedColumnName: 'id' })
  contractor: Contractor;
}

export default Team;
