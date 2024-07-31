import {
  IsString,
  IsNumber,
  IsUUID,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsUUID()
  categoryId: string;

  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
