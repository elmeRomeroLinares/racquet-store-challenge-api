import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  image_url: string;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, default: null })
  modified_at: Date | null;

  @ManyToOne(() => ProductCategory, (category) => category.id)
  category: ProductCategory;

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
