import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/authentication/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedAt: Date;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany(() => User, (user) => user.likedProducts)
  likedBy: User[];
}
