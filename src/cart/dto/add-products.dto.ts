import { IsNumber, IsUUID } from 'class-validator';

export class AddProductToCartDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;
}
