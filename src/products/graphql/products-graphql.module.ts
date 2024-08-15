import { Module } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { AuthenticationModule } from '@src/authentication/authentication.module';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]),
    AuthenticationModule,
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsGraphQlModule {}
