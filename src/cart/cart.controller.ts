import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductsDto } from './dto/add-products.dto';
import { Cart } from './entities/cart.entity';
import { JwtAuthenticationGuard } from 'src/authentication/jwt-authentication.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserRole } from 'src/authentication/enums/user-role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { JWTPayload } from 'src/authentication/dto/jwt-payload.dto';
import { RemoveProductsDto } from './dto/remove-products.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('addProducts')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Customer)
  async addProducts(
    @Body() addProductsDto: AddProductsDto,
    @Req() req,
  ): Promise<Cart> {
    const jwtPayload = req.user as JWTPayload;
    return await this.cartService.addProducts(addProductsDto, jwtPayload.sub);
  }

  @Delete('removeProducts')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Customer)
  async removeProducts(
    @Body() removeProductsDto: RemoveProductsDto,
    @Req() req,
  ): Promise<Cart> {
    const jwtPayload = req.user as JWTPayload;
    return await this.cartService.removeProducts(
      removeProductsDto,
      jwtPayload.sub,
    );
  }
}
