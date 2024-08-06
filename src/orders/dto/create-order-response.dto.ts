import { Product } from '@src/products/entities/product.entity';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderResponse {
  id: string;
  products: Product[];
  userId: string;
  createdAt: Date;
  status: OrderStatus;
}
