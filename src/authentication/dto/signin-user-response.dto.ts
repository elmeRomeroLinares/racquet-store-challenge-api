import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInUserResponse {
  @Field()
  accessToken: string;
}
