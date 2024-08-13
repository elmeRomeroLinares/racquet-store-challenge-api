import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductToCartDto } from './dto/add-products.dto';
import { Cart } from './entities/cart.entity';
import { JwtAuthenticationGuard } from '@src/authentication/jwt/jwt-authentication.guard';
import { UserRole } from '@src/authentication/enums/user-role.enum';
import { JWTPayload } from '@src/authentication/dto/jwt-payload.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getUserCart(@Req() req: any, @Query() userId?: string): Promise<Cart> {
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    return this.cartService.getUserCart(targetUserId);
  }

  @Post('addProduct')
  @UseGuards(JwtAuthenticationGuard)
  async addProduct(
    @Body() addProductToCartDto: AddProductToCartDto,
    @Req() req: any,
    @Query() userId?: string,
  ): Promise<Cart> {
    const jwtPayload = req.user as JWTPayload;
    const targetUserId =
      jwtPayload.role === UserRole.Admin && userId ? userId : jwtPayload.sub;
    return await this.cartService.addProduct(addProductToCartDto, targetUserId);
  }
}
