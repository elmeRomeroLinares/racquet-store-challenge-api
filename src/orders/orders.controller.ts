import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { CreateOrderResponse } from './dto/create-order-response.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('order')
  create(@Body() createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    return this.ordersService.create(createOrderDto);
  }
}
