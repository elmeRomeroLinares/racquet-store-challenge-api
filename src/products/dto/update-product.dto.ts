import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsUUID,
  IsString,
  IsNumber,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

@InputType()
export class UpdateProductDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  price?: number;

  @Field({ nullable: true })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

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
  inventoryLevel?: number;
}
