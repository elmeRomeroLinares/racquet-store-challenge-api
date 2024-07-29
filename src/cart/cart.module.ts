import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { ProductsModule } from 'src/products/products.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    ProductsModule,
    AuthenticationModule,
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
