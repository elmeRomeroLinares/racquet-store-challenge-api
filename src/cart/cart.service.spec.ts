import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-items.entity';
import { User } from '@src/authentication/entities/user.entity';
import { Product } from '@src/products/entities/product.entity';
import { AddProductToCartDto } from './dto/add-products.dto';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;
  let userRepository: Repository<User>;
  let productsRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(
      getRepositoryToken(CartItem),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('getUserCart', () => {
    it('should return the user cart', async () => {
      const user = new User();
      user.id = '1';
      user.cart = new Cart();
      user.cart.id = '1';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(cartRepository, 'save').mockResolvedValue(user.cart);

      const result = await service.getUserCart('1');

      expect(result).toEqual(user.cart);
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getUserCart('1')).rejects.toThrow('User not found');
    });

    it('should create a new cart if user has no cart', async () => {
      const user = new User();
      user.id = '1';
      user.cart = null;

      const newCart = new Cart();
      newCart.id = '1';
      newCart.user = user;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(cartRepository, 'create').mockReturnValue(newCart);
      jest.spyOn(cartRepository, 'save').mockResolvedValue(newCart);

      const result = await service.getUserCart('1');

      expect(result).toEqual(newCart);
    });
  });

  describe('addProduct', () => {
    it('should add a product to the cart', async () => {
      const user = new User();
      user.id = '1';
      user.cart = new Cart();
      user.cart.id = '1';
      user.cart.items = [];

      const product = new Product();
      product.id = '1';
      product.disabled = false;

      const addProductToCartDto: AddProductToCartDto = {
        productId: '1',
        quantity: 1,
      };

      jest.spyOn(service, 'getUserCart').mockResolvedValue(user.cart);
      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValue(product);
      jest.spyOn(cartItemRepository, 'findOne').mockResolvedValue(null);

      const cartItem = new CartItem();
      cartItem.cart = user.cart;
      cartItem.product = product;
      cartItem.quantity = addProductToCartDto.quantity;

      jest.spyOn(cartItemRepository, 'create').mockReturnValue(cartItem);
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(cartItem);
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(user.cart);

      const result = await service.addProduct(addProductToCartDto, '1');

      expect(result).toEqual(user.cart);
    });

    it('should update the quantity if product already in cart', async () => {
      const user = new User();
      user.id = '1';
      user.cart = new Cart();
      user.cart.id = '1';

      const product = new Product();
      product.id = '1';
      product.disabled = false;

      const addProductToCartDto: AddProductToCartDto = {
        productId: '1',
        quantity: 1,
      };

      const existingCartItem = new CartItem();
      existingCartItem.cart = user.cart;
      existingCartItem.product = product;
      existingCartItem.quantity = 1;

      user.cart.items = [existingCartItem];

      jest.spyOn(service, 'getUserCart').mockResolvedValue(user.cart);
      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValue(product);
      jest
        .spyOn(cartItemRepository, 'findOne')
        .mockResolvedValue(existingCartItem);

      const updatedCartItem = { ...existingCartItem, quantity: 2 };
      jest.spyOn(cartItemRepository, 'save').mockResolvedValue(updatedCartItem);

      const updatedCart = { ...user.cart, items: [updatedCartItem] };
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(updatedCart);

      const result = await service.addProduct(addProductToCartDto, '1');

      expect(result.items[0].quantity).toBe(2);
    });

    it('should throw an error if product not found or disabled', async () => {
      const addProductToCartDto: AddProductToCartDto = {
        productId: '1',
        quantity: 1,
      };
      const user = new User();
      user.id = '1';

      const newCart = new Cart();
      newCart.id = '1';
      user.cart = newCart;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.addProduct(addProductToCartDto, '1'),
      ).rejects.toThrow('Product not found or is disabled');
    });
  });
});
