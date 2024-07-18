import {
  Body,
  Controller,
  Get,
  Post,
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
import { ProductCategory } from './entities/product-category.entity';
import { PaginatedResultDto } from '../pagination/dto/paginated-result.dto';
import { PaginationQueryDto } from '../pagination/dto/pagination-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('category')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async createProductCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
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
    return this.productsService.getProductCategories(paginationQuery);
  }
}
