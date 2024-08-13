import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '@src/products/entities/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CartItem {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  // On a real db the deletion of a product may be reflected better by a product status DELETED
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Field()
  @Column()
  quantity: number;
}
