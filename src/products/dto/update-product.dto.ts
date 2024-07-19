import {
  IsUUID,
  IsString,
  IsNumber,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
