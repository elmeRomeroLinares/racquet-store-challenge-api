import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer',
}

registerEnumType(UserRole, {
  name: 'UserRole', // this is the name that will be used in the GraphQL schema
});
