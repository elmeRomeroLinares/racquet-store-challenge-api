import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/authentication/entities/user.entity';
import { CreateOrderResponse } from './dto/create-order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    const { productsIds, userId, status } = createOrderDto;

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const productEntities = await this.productsRepository.find({
      where: { id: In(productsIds) },
    });
    if (productEntities.length !== productsIds.length) {
      throw new Error('Some products not found');
    }

    const order = new Order();
    order.products = productEntities;
    order.user = user;
    order.status = status;

    const savedOrder = await this.ordersRepository.save(order);

    return {
      id: savedOrder.id,
      products: savedOrder.products,
      userId: savedOrder.user.id,
      createdAt: savedOrder.createdAt,
      status: savedOrder.status,
    };
  }
}
