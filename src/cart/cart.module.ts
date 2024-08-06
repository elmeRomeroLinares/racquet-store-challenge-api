import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { ProductsModule } from '@src/products/products.module';
import { AuthenticationModule } from '@src/authentication/authentication.module';
import { CartItem } from './entities/cart-items.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductsModule,
    AuthenticationModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService, TypeOrmModule],
})
export class CartModule {}
