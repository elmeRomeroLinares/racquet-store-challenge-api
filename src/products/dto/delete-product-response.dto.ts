import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteProductResponseDto {
  @Field(() => Int)
  affectedRows: number;
}
