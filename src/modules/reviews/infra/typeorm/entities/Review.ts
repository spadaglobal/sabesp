import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
} from 'typeorm';

import ReviewsRequirements from './ReviewsRequirements';

@Entity('reviews')
class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @Column()
  observation: string;

  @Column()
  image: string;

  @Column()
  @Generated('uuid')
  reason_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => ReviewsRequirements,
    reviewsToRequirements => reviewsToRequirements.review,
  )
  reviewsToRequirements: ReviewsRequirements[];

  @Expose({ name: 'image_url' })
  getFileUrl(): string | null {
    return this.image
      ? `${process.env.APP_API_URL}/images/${this.image}`
      : null;
  }
}

export default Review;
