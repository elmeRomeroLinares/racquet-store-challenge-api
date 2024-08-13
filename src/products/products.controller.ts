import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthenticationGuard } from '../authentication/jwt/jwt-authentication.guard';
import { UserRole } from '../authentication/enums/user-role.enum';
import { Category } from './entities/category.entity';
import { PaginatedResultDto } from '../pagination/dto/paginated-result.dto';
import { PaginationQueryDto } from '../pagination/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DeleteProductResponseDto } from './dto/delete-product-response.dto';
import { PaginatedProductsQueryDto } from './dto/paginated-products-query.dto';
import { JWTPayload } from '@src/authentication/dto/jwt-payload.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('category')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async createProductCategory(
    @Body(new ValidationPipe())
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<Category> {
    return await this.productsService.createProductCategory(
      createProductCategoryDto,
    );
  }

  @Get('categories')
  async getProductCategories(
    @Query(new ValidationPipe()) query: PaginationQueryDto,
  ): Promise<PaginatedResultDto<Category>> {
    const paginationQuery: PaginationQueryDto = {
      page: query.page || 1,
      limit: query.limit || 10,
    };
    return await this.productsService.getProductCategories(paginationQuery);
  }

  @Post('product')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async createProduct(
    @Body(new ValidationPipe())
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }

  @Put('product/:productId')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async updateProduct(
    @Param('productId') productId: string,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.updateProduct(
      productId,
      updateProductDto,
    );
  }

  @Delete('product/:productId')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async deleteProduct(
    @Param('productId') productId: string,
  ): Promise<DeleteProductResponseDto> {
    return await this.productsService.deleteProduct(productId);
  }

  @Get()
  async getProducts(
    @Query(new ValidationPipe()) query: PaginatedProductsQueryDto,
  ): Promise<PaginatedResultDto<Product>> {
    const paginationQuery: PaginatedProductsQueryDto = {
      page: query.page || 1,
      limit: query.limit || 10,
      categoryId: query.categoryId,
    };

    return await this.productsService.getProducts(paginationQuery);
  }

  @Get('product/:productId')
  async getProduct(@Param('productId') productId: string): Promise<Product> {
    return await this.productsService.getProduct(productId);
  }

  @Post('like/:productId')
  @UseGuards(JwtAuthenticationGuard)
  async likeProduct(
    @Param('productId') productId: string,
    @Req() req: any,
  ): Promise<Product[]> {
    const jwtPayload = req.user as JWTPayload;
    return await this.productsService.likeProduct(jwtPayload.sub, productId);
  }
}
