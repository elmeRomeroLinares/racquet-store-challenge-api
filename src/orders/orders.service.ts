import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CartService } from '@src/cart/cart.service';
import { OrderItem } from './entities/order-item.entity';
import { CartItem } from '@src/cart/entities/cart-items.entity';
import { OrderStatus } from './enums/order-status.enum';
import { PaginatedResultDto } from '@src/pagination/dto/paginated-result.dto';
import { PaginationQueryDto } from '@src/pagination/dto/pagination-query.dto';
import { User } from '@src/authentication/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly cartService: CartService,
  ) {}

  async createOrderFromCart(userId: string) {
    const userCart = await this.cartService.getUserCart(userId);
    if (!userCart || userCart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    const order = this.ordersRepository.create({
      user,
    });
    await this.ordersRepository.save(order);

    for (const cartItem of userCart.items) {
      const orderItem = this.orderItemRepository.create({
        order,
        product: cartItem.product,
        quantity: cartItem.quantity,
      });
      await this.orderItemRepository.save(orderItem);
    }

    await this.cartItemRepository.remove(userCart.items);

    return await this.ordersRepository.findOne({
      where: { id: order.id },
      relations: ['items', 'items.product'],
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.getOrder(orderId);
    order.status = status;
    return await this.ordersRepository.save(order);
  }

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }

  async getAllOrders(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResultDto<Order>> {
    const { page, limit } = paginationQuery;
    const [data, total] = await this.ordersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      total,
      page,
      limit,
    };
  }
}
