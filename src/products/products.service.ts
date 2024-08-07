import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { Category } from './entities/category.entity';
import { PaginationQueryDto } from '@src/pagination/dto/pagination-query.dto';
import { PaginatedResultDto } from '@src/pagination/dto/paginated-result.dto';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductResponseDto } from './dto/delete-product-response.dto';
import { PaginatedProductsQueryDto } from './dto/paginated-products-query.dto';
import { User } from '@src/authentication/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Category)
    private readonly productCategoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.productCategoryRepository.findOne({
      where: { name: createProductCategoryDto.name },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    const category = this.productCategoryRepository.create({
      ...createProductCategoryDto,
    });
    return await this.productCategoryRepository.save(category);
  }

  async getProductCategories(
    paginationQuery: PaginationQueryDto = new PaginationQueryDto(),
  ): Promise<PaginatedResultDto<Category>> {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;
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

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
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
      imageUrl: createProductDto.imageUrl,
      disabled: createProductDto.disabled ?? false,
      inventoryLevel: createProductDto.invenotryLevel ?? 0,
    });

    return await this.productRepository.save(product);
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
      relations: ['category'],
    });
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getProduct(productId: string): Promise<Product> {
    return await this.productRepository.findOneBy({ id: productId });
  }

  async likeProduct(userId: string, productId: string): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedProducts'],
    });

    if (user.likedProducts.some((p) => p.id === productId)) {
      return user.likedProducts;
    }

    const product = await this.productRepository.findOneBy({ id: productId });

    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    user.likedProducts.push(product);
    const modifiedUser = await this.userRepository.save(user);

    return modifiedUser.likedProducts;
  }

  async updateInventoryLevel(
    productId: string,
    newInventoryLevel: number,
  ): Promise<Product> {
    if (newInventoryLevel < 0) {
      throw new Error('Inventory level bellow 0');
    }
    const product = await this.getProduct(productId);
    product.inventoryLevel = newInventoryLevel;
    return await this.productRepository.save(product);
  }
}
