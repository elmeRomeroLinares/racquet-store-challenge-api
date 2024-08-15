import { UseGuards } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { RolesGuard } from '@src/guards/roles.guard';
import { Roles } from '@src/decorators/roles.decorator';
import { JwtAuthenticationGuard } from '@src/authentication/jwt/jwt-authentication.guard';
import { UserRole } from '@src/authentication/enums/user-role.enum';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { DeleteProductResponseDto } from '../dto/delete-product-response.dto';
import { PaginatedProductsQueryDto } from '../dto/paginated-products-query.dto';
import { JWTPayload } from '@src/authentication/dto/jwt-payload.dto';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQlPaginatedResult } from '@src/pagination/dto/graphql-paginated-result.dto';
import { ProductDTO } from '../dto/product.dto';
import { ProductMapper } from '../mappers/product-mappers';
import { LikeProductResponseDto } from '../dto/like-product-response.dto';

const PaginatedCategoriesResult = GraphQlPaginatedResult(Category, 'Category');
const PaginatedProductsResult = GraphQlPaginatedResult(ProductDTO, 'Product');

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Category)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async createCategory(
    @Args('createCategoryDto') createCategoryDto: CreateProductCategoryDto,
  ): Promise<Category> {
    return await this.productsService.createProductCategory(createCategoryDto);
  }

  @Query(() => PaginatedCategoriesResult)
  async getCategories(
    @Args('page', { type: () => Int, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
  ): Promise<typeof PaginatedCategoriesResult> {
    return await this.productsService.getProductCategories({ page, limit });
  }

  @Mutation(() => ProductDTO)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async createProduct(
    @Args('createProductDto') createProductDto: CreateProductDto,
  ): Promise<ProductDTO> {
    const product = await this.productsService.createProduct(createProductDto);
    return ProductMapper.toDTO(product);
  }

  @Mutation(() => ProductDTO)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductDto') updateProductDto: UpdateProductDto,
  ): Promise<ProductDTO> {
    const product = await this.productsService.updateProduct(
      productId,
      updateProductDto,
    );
    return ProductMapper.toDTO(product);
  }

  @Mutation(() => DeleteProductResponseDto)
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async deleteProduct(
    @Args('productId') productId: string,
  ): Promise<DeleteProductResponseDto> {
    return await this.productsService.deleteProduct(productId);
  }

  @Query(() => PaginatedProductsResult)
  async getProducts(
    @Args('page', { type: () => Int, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
    @Args('categoryId', { nullable: true }) categoryId?: string,
  ): Promise<typeof PaginatedProductsResult> {
    const paginationQuery: PaginatedProductsQueryDto = {
      page,
      limit,
      categoryId,
    };

    const pagedProducts =
      await this.productsService.getProducts(paginationQuery);

    const productDTOs = pagedProducts.data.map((product) => {
      return ProductMapper.toDTO(product);
    });
    return {
      data: productDTOs,
      total: pagedProducts.total,
      page: pagedProducts.page,
      limit: pagedProducts.limit,
    };
  }

  @Query(() => ProductDTO)
  async getProductDetail(
    @Args('productId') productId: string,
  ): Promise<ProductDTO> {
    const product = await this.productsService.getProduct(productId);
    return ProductMapper.toDTO(product);
  }

  @Mutation(() => LikeProductResponseDto)
  @UseGuards(JwtAuthenticationGuard)
  async likeProduct(
    @Context() context: any,
    @Args('productId') productId: string,
  ): Promise<LikeProductResponseDto> {
    const req = context.req;
    const jwtPayload = req.user as JWTPayload;
    const likedProducts = await this.productsService.likeProduct(
      jwtPayload.sub,
      productId,
    );
    return {
      likedProductsByUser: likedProducts.map((product) => {
        return ProductMapper.toDTO(product);
      }),
    };
  }
}
