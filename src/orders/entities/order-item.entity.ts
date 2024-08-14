import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '@src/products/entities/product.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class OrderItem {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  // On a real db the deletion of a product may be reflected better by a product status DELETED
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Field(() => Int)
  @Column()
  quantity: number;
}
