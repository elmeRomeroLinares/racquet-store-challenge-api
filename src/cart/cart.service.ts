import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from '@src/authentication/entities/user.entity';
import { Product } from '@src/products/entities/product.entity';
import { AddProductToCartDto } from './dto/add-products.dto';
import { CartItem } from './entities/cart-items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getUserCart(userId: string): Promise<Cart> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['cart', 'cart.items', 'cart.items.product'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.cart) {
      return user.cart;
    }

    const cart = this.cartRepository.create({ user });
    return await this.cartRepository.save(cart);
  }

  async addProduct(
    addProductToCartDto: AddProductToCartDto,
    userId: string,
  ): Promise<Cart> {
    const userCart = await this.getUserCart(userId);

    const product = await this.productsRepository.findOneBy({
      id: addProductToCartDto.productId,
    });

    if (!product || product.disabled) {
      throw new NotFoundException('Product not found or is disabled');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { cart: { id: userCart.id }, product: { id: product.id } },
    });
    if (cartItem) {
      cartItem.quantity += addProductToCartDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart: userCart,
        product: product,
        quantity: addProductToCartDto.quantity,
      });
    }

    if (product.inventoryLevel < cartItem.quantity) {
      throw new ConflictException(
        `Product ${product.name} is out of stock, current stock is ${product.inventoryLevel}`,
      );
    }

    await this.cartItemRepository.save(cartItem);

    const updatedCart = await this.cartRepository.findOne({
      where: { id: userCart.id },
      relations: ['items', 'items.product'],
    });

    return updatedCart;
  }
}
