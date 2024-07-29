import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class RemoveProductsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  productIds: string[];
}
