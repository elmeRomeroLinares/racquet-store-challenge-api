import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductCategoryResponseDto } from './dto/create-product-category-response.dto';
import { ProductCategory } from './entities/product-category.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { PaginatedResultDto } from 'src/pagination/dto/paginated-result.dto';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductResponseDto } from './dto/create-product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { timeStamp } from 'console';
import { DeleteProductResponseDto } from './dto/delete-product-response.dto';
import { PaginatedProductsQueryDto } from './dto/paginated-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<CreateProductCategoryResponseDto> {
    const existingCategory = await this.productCategoryRepository.findOne({
      where: { categoryName: createProductCategoryDto.categoryName },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    const category = this.productCategoryRepository.create({
      ...createProductCategoryDto,
    });
    const newCategory = await this.productCategoryRepository.save(category);
    return { categoryId: newCategory.id };
  }

  async getProductCategories(
    paginationQuery: PaginationQueryDto = new PaginationQueryDto(),
  ): Promise<PaginatedResultDto<ProductCategory>> {
    console.log('paginationQuery', paginationQuery);
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;
    console.log(skip);
    const [data, total] = await this.productCategoryRepository.findAndCount({
      skip: skip,
      take: limit,
    });
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<CreateProductResponseDto> {
    const category = await this.productCategoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException(
        'Product name already in use. To update a product provide a product ID on the request',
      );
    }

    const product = this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      category: category,
      image_url: createProductDto.imageUrl,
      disabled: createProductDto.disabled ?? false,
    });

    const createdProduct = await this.productRepository.save(product);

    return { createdProductId: createdProduct.id };
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (updateProductDto.categoryId) {
      const category = await this.productCategoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
      product.category = category;
    }

    Object.assign(product, updateProductDto);
    product.modified_at = new Date();
    return await this.productRepository.save(product);
  }

  async deleteProduct(productId: string): Promise<DeleteProductResponseDto> {
    const result = await this.productRepository.delete(productId);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return { affectedRows: result.affected };
  }

  async getProducts(
    paginationQuery: PaginatedProductsQueryDto,
  ): Promise<PaginatedResultDto<Product>> {
    const { page, limit, categoryId } = paginationQuery;
    const [data, total] = await this.productRepository.findAndCount({
      where: categoryId ? { category: { id: categoryId } } : {},
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      total,
      page,
      limit,
    };
  }
}
