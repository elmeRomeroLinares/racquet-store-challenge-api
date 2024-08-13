import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsUUID } from 'class-validator';

@InputType()
export class AddProductToCartDto {
  @Field()
  @IsUUID()
  productId: string;

  @Field(() => Int)
  @IsNumber()
  quantity: number;
}
