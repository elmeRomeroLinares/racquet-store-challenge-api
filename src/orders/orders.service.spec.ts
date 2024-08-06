import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '@src/authentication/entities/user.entity';
import { CartItem } from '@src/cart/entities/cart-items.entity';
import { CartService } from '@src/cart/cart.service';
import { OrderStatus } from './enums/order-status.enum';
import { PaginationQueryDto } from '@src/pagination/dto/pagination-query.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let userRepository: Repository<User>;
  let cartItemRepository: Repository<CartItem>;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useClass: Repository,
        },
        {
          provide: CartService,
          useValue: {
            getUserCart: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(
      getRepositoryToken(OrderItem),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cartItemRepository = module.get<Repository<CartItem>>(
      getRepositoryToken(CartItem),
    );
    cartService = module.get<CartService>(CartService);
  });

  describe('createOrderFromCart', () => {
    it('should create an order from the cart', async () => {
      const userId = '1';
      const userCart = {
        items: [
          {
            product: {},
            quantity: 1,
          },
        ],
      };

      const user = new User();
      user.id = '1';

      const order = new Order();
      order.id = '1';

      jest.spyOn(cartService, 'getUserCart').mockResolvedValue(userCart as any);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(ordersRepository, 'create').mockReturnValue(order);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);
      jest.spyOn(orderItemRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(orderItemRepository, 'save').mockResolvedValue({} as any);
      jest
        .spyOn(cartItemRepository, 'remove')
        .mockResolvedValue(userCart.items as any);
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order as any);

      const result = await service.createOrderFromCart(userId);

      expect(result).toEqual(order);
    });

    it('should throw an error if cart is empty', async () => {
      const userId = '1';
      const userCart = { items: [] };

      jest.spyOn(cartService, 'getUserCart').mockResolvedValue(userCart as any);

      await expect(service.createOrderFromCart(userId)).rejects.toThrow(
        'Cart is empty',
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the status of an order', async () => {
      const orderId = '1';
      const status = OrderStatus.Shipped;
      const order = new Order();
      order.id = '1';
      order.status = OrderStatus.Pending;

      jest.spyOn(service, 'getOrder').mockResolvedValue(order);
      jest
        .spyOn(ordersRepository, 'save')
        .mockResolvedValue({ ...order, status });

      const result = await service.updateOrderStatus(orderId, status);

      expect(result.status).toBe(status);
    });
  });

  describe('getOrder', () => {
    it('should return an order by ID', async () => {
      const orderId = '1';
      const order = new Order();
      order.id = '1';

      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order);

      const result = await service.getOrder(orderId);

      expect(result).toEqual(order);
    });

    it('should throw an error if order is not found', async () => {
      const orderId = '1';

      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getOrder(orderId)).rejects.toThrow(
        'Order not found',
      );
    });
  });

  describe('getUserOrders', () => {
    it('should return orders for a user', async () => {
      const userId = '1';
      const orders = [new Order()];

      jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders);

      const result = await service.getUserOrders(userId);

      expect(result).toEqual(orders);
    });
  });

  describe('getAllOrders', () => {
    it('should return paginated orders', async () => {
      const paginationQuery: PaginationQueryDto = {
        page: 1,
        limit: 10,
      };

      const orders = [new Order()];
      jest
        .spyOn(ordersRepository, 'findAndCount')
        .mockResolvedValue([orders, 1]);

      const result = await service.getAllOrders(paginationQuery);

      expect(result).toEqual({
        data: orders,
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });
});
