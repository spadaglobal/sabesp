import Requirement from '@modules/requirements/infra/typeorm/entities/Requirement';
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

import Review from './Review';

@Entity('reviews_requirements')
class ReviewsRequirements {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  review_id: string;

  @Column()
  @Generated('uuid')
  requirement_id: string;

  @Column()
  @Generated('uuid')
  lv_id: string;

  @Column()
  @Generated('uuid')
  lv_pos_id: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Requirement)
  @JoinColumn({ name: 'requirement_id', referencedColumnName: 'id' })
  requirement: Requirement;

  @ManyToOne(() => Review)
  @JoinColumn({ name: 'review_id', referencedColumnName: 'id' })
  review: Review;
}

export default ReviewsRequirements;
