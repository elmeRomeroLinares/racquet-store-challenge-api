import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field()
  @IsUUID()
  categoryId: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  invenotryLevel?: number;
}
