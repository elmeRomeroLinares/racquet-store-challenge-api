import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { Order } from '../entities/order.entity';
import { JwtAuthenticationGuard } from '@src/authentication/jwt/jwt-authentication.guard';
import { JWTPayload } from '@src/authentication/dto/jwt-payload.dto';
import { UserRole } from '@src/authentication/enums/user-role.enum';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/decorators/roles.decorator';
import { OrderStatus } from '../enums/order-status.enum';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderDTO } from '../dto/order.dto';
import { GraphQlPaginatedResult } from '@src/pagination/dto/graphql-paginated-result.dto';
import { OrderMapper } from '../mappers/order-mapper';

const PaginatedOrderResult = GraphQlPaginatedResult(OrderDTO, 'Order');

@Resolver()
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => OrderDTO)
  @UseGuards(JwtAuthenticationGuard)
  async createOrderFromCart(
    @Context() context: any,
    @Args('userId', { nullable: true }) userId?: string,
  ): Promise<OrderDTO> {
    const req = context.req;
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    const order = await this.ordersService.createOrderFromCart(targetUserId);
    return {
      id: order.id,
      userId: targetUserId,
      orderItems: order.items,
      createdAt: order.createdAt,
      orderStatus: order.status,
    };
  }

  @Mutation(() => OrderDTO)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async updateOrderStatus(
    @Args('orderId') orderId: string,
    @Args('orderStatus', { type: () => OrderStatus }) orderStatus: OrderStatus,
  ): Promise<OrderDTO> {
    const order = await this.ordersService.updateOrderStatus(
      orderId,
      orderStatus,
    );
    return {
      id: order.id,
      userId: order.user.id,
      orderItems: order.items,
      createdAt: order.createdAt,
      orderStatus: order.status,
    };
  }

  @Query(() => OrderDTO)
  @UseGuards(JwtAuthenticationGuard)
  async getOrder(
    @Context() context: any,
    @Args('orderId') orderId: string,
  ): Promise<Order> {
    const req = context.req;
    const jwtPayload = req.user as JWTPayload;
    const order = await this.ordersService.getOrder(orderId);
    const orderOwnerId = order.user.id;
    if (
      jwtPayload.role == UserRole.Customer &&
      orderOwnerId != jwtPayload.sub
    ) {
      throw new UnauthorizedException();
    }
    return order;
  }

  @Query(() => [OrderDTO])
  @UseGuards(JwtAuthenticationGuard)
  async getOrders(
    @Context() context: any,
    @Args('userId', { nullable: true }) userId?: string,
  ): Promise<OrderDTO[]> {
    const req = context.req;
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    if (!targetUserId) {
      throw new Error('User Id required');
    }
    const orders = await this.ordersService.getUserOrders(targetUserId);

    const orderDTOs: OrderDTO[] = orders.map((order) => {
      return OrderMapper.toDTO(order);
    });

    return orderDTOs;
  }

  @Query(() => PaginatedOrderResult)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async getAllOrders(
    @Args('page', { type: () => Int, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
  ): Promise<typeof PaginatedOrderResult> {
    const [orders, total] = await this.ordersService.getOrdersWithTotal(
      page,
      limit,
    );
    return {
      data: orders,
      total: total,
      page: page,
      limit: limit,
    };
  }
}
