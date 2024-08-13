import { Module } from '@nestjs/common';
import { CartService } from '../cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { ProductsModule } from '@src/products/products.module';
import { AuthenticationModule } from '@src/authentication/authentication.module';
import { CartItem } from '../entities/cart-items.entity';
import { CartResolver } from './cart.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    AuthenticationModule,
  ],
  providers: [CartService, CartResolver],
  exports: [CartService, TypeOrmModule],
})
export class CartGraphQlModule {}
