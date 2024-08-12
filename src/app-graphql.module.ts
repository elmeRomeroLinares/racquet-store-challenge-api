import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationGraphQlModule } from './authentication/authentication-graphql.module';
import { ProductsModule } from './products/products.module';
import { dataSourceOptions } from './data-source';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthenticationGraphQlModule,
    // ProductsModule,
    // OrdersModule,
    // CartModule,
  ],
})
export class AppGraphModule {}
