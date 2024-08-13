import { Field, ObjectType } from '@nestjs/graphql';
import { CartItem } from '../entities/cart-items.entity';

@ObjectType()
export class CartDTO {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  modifiedAt: Date;

  @Field()
  userId: string;

  @Field(() => [CartItem])
  cartIems: CartItem[];
}
