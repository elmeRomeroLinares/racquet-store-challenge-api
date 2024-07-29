import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AddProductsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  productIds: string[];
}
