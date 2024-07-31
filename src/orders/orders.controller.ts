import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { JwtAuthenticationGuard } from 'src/authentication/jwt-authentication.guard';
import { JWTPayload } from 'src/authentication/dto/jwt-payload.dto';
import { UserRole } from 'src/authentication/enums/user-role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { OrderStatus } from './enums/order-status.enum';
import { PaginatedResultDto } from 'src/pagination/dto/paginated-result.dto';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('order')
  @UseGuards(JwtAuthenticationGuard)
  async createOrderFromCart(
    @Req() req: any,
    @Query() userId?: string,
  ): Promise<Order> {
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    return this.ordersService.createOrderFromCart(targetUserId);
  }

  @Put('order/:orderId')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() orderStatus: OrderStatus,
  ): Promise<Order> {
    return await this.ordersService.updateOrderStatus(orderId, orderStatus);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthenticationGuard)
  async getOrder(@Param('orderId') orderId: string): Promise<Order> {
    return await this.ordersService.getOrder(orderId);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getOrders(@Req() req: any, @Query() userId?: string) {
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    if (!targetUserId) {
      throw new Error('User Id required');
    }
    return await this.ordersService.getUserOrders(targetUserId);
  }

  @Get('all')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async getAllOrders(
    @Query(new ValidationPipe()) query: PaginationQueryDto,
  ): Promise<PaginatedResultDto<Order>> {
    const paginationQuery: PaginationQueryDto = {
      page: query.page || 1,
      limit: query.limit || 10,
    };
    return await this.ordersService.getAllOrders(paginationQuery);
  }
}
