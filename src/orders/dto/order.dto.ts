import { Field, ObjectType } from '@nestjs/graphql';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';

@ObjectType()
export class OrderDTO {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field()
  createdAt: Date;

  @Field(() => OrderStatus)
  orderStatus: OrderStatus;
}
