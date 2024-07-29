import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductCategoryResponseDto } from './dto/create-product-category-response.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { UserRole } from '../authentication/enums/user-role.enum';
import { ProductCategory } from './entities/category.entity';
import { PaginatedResultDto } from '../pagination/dto/paginated-result.dto';
import { PaginationQueryDto } from '../pagination/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DeleteProductResponseDto } from './dto/delete-product-response.dto';
import { PaginatedProductsQueryDto } from './dto/paginated-products-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('category')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async createProductCategory(
    @Body(new ValidationPipe())
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<CreateProductCategoryResponseDto> {
    return await this.productsService.createProductCategory(
      createProductCategoryDto,
    );
  }

  @Get('categories')
  async getProductCategories(
    @Query(new ValidationPipe()) query: PaginationQueryDto,
  ): Promise<PaginatedResultDto<ProductCategory>> {
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
  ): Promise<CreateProductResponseDto> {
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
}
