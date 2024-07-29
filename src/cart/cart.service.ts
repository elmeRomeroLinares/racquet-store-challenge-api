import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'src/authentication/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { AddProductsDto } from './dto/add-products.dto';
import { RemoveProductsDto } from './dto/remove-products.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getUserCart(userId: string): Promise<Cart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // const existingCart = await this.cartRepository.findOneBy({ userId });
    const userCart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['products'],
    });
    if (userCart) {
      console.log('existingCart', userCart);
      console.log('existingCartProducts', userCart.products);
      return userCart;
    }

    const cart = new Cart();
    cart.userId = userId;

    return this.cartRepository.save(cart);
  }

  async addProducts(
    addProductsDto: AddProductsDto,
    userId: string,
  ): Promise<Cart> {
    const userCart = await this.getUserCart(userId);

    const productEntities = await this.productsRepository.find({
      where: {
        id: In(addProductsDto.productIds),
        disabled: false,
      },
    });

    if (productEntities.length !== addProductsDto.productIds.length) {
      throw new Error('Some products where not found or are disabled');
    }
    console.log(userCart.products);
    if (!userCart.products) {
      console.log('inside if');
      userCart.products = [];
    }

    userCart.products = [...userCart.products, ...productEntities];
    console.log(userCart.products);
    return this.cartRepository.save(userCart);
  }

  async removeProducts(
    removeProductsDto: RemoveProductsDto,
    userId: string,
  ): Promise<Cart> {
    const userCart = await this.getUserCart(userId);

    userCart.products = userCart.products.filter(
      (product) => !removeProductsDto.productIds.includes(product.id),
    );

    return await this.cartRepository.save(userCart);
  }
}
