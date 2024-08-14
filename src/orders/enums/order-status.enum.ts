import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'Pending',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Canceled',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
