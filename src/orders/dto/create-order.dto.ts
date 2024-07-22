import {
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  readonly productsIds: string[];

  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  readonly status: OrderStatus;
}
