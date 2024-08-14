import { UseGuards } from '@nestjs/common';
import { CartService } from '../cart.service';
import { AddProductToCartDto } from '../dto/add-products.dto';
import { JwtAuthenticationGuard } from '@src/authentication/jwt/jwt-authentication.guard';
import { UserRole } from '@src/authentication/enums/user-role.enum';
import { JWTPayload } from '@src/authentication/dto/jwt-payload.dto';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartDTO } from '../dto/cart.dto';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartDTO)
  @UseGuards(JwtAuthenticationGuard)
  async getUserCart(
    @Context() context: any,
    @Args('userId', { nullable: true }) userId?: string,
  ): Promise<CartDTO> {
    const req = context.req;
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    const cart = await this.cartService.getUserCart(targetUserId);
    return {
      id: cart.id,
      createdAt: cart.createdAt,
      modifiedAt: cart.modifiedAt,
      userId: targetUserId,
      cartIems: cart.items,
    };
  }

  @Mutation(() => CartDTO)
  @UseGuards(JwtAuthenticationGuard)
  async addProductToCart(
    @Context() context: any,
    @Args('addProductToCartDto') addProductToCartDto: AddProductToCartDto,
    @Args('userId', { nullable: true }) userId?: string,
  ): Promise<CartDTO> {
    const req = context.req;
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    const cart = await this.cartService.addProduct(
      addProductToCartDto,
      targetUserId,
    );
    return {
      id: cart.id,
      createdAt: cart.createdAt,
      modifiedAt: cart.modifiedAt,
      userId: targetUserId,
      cartIems: cart.items,
    };
  }
}
