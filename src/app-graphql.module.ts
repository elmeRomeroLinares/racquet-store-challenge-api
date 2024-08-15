import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationGraphQlModule } from './authentication/graphql/authentication-graphql.module';
import { dataSourceOptions } from './data-source';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CartGraphQlModule } from './cart/graphql/cart-graphql.module';
import { OrdersGraphQlModule } from './orders/graphql/orders-graphql.module';
import { ProductsGraphQlModule } from './products/graphql/products-graphql.module';

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
    ProductsGraphQlModule,
    OrdersGraphQlModule,
    CartGraphQlModule,
  ],
})
export class AppGraphModule {}
