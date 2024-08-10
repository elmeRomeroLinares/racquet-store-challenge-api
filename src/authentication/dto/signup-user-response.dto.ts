import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../enums/user-role.enum';

@ObjectType()
export class SignUpUserResponseDto {
  @Field()
  createdUserUuid: string;
  @Field(() => UserRole)
  role: UserRole;
}
