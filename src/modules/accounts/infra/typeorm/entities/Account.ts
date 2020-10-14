import Task from '@modules/tasks/infra/typeorm/entities/Task';
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

@Entity('accounts')
class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  @Generated('uuid')
  task_type_id: string;

  @Column()
  code: string;

  @ManyToMany(() => Task)
  @JoinTable({
    name: 'accounts_tasks',
    joinColumn: {
      name: 'accountsId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tasksId',
      referencedColumnName: 'id',
    },
  })
  tasks: Task[];

  @Column()
  @Generated('uuid')
  group_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Account;
