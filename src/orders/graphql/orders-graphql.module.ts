import { Module } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { ProductsModule } from '@src/products/products.module';
import { AuthenticationModule } from '@src/authentication/authentication.module';
import { OrderItem } from '../entities/order-item.entity';
import { CartModule } from '@src/cart/cart.module';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductsModule,
    AuthenticationModule,
    CartModule,
  ],
  providers: [OrdersService, OrdersResolver],
})
export class OrdersGraphQlModule {}
