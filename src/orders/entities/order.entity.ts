import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from 'src/authentication/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable({
    name: 'order_products',
    joinColumn: {
      name: 'order',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;
}
