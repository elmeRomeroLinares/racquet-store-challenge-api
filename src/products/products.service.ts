import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductCategoryResponseDto } from './dto/create-product-category-response.dto';
import { ProductCategory } from './entities/product-category.entity';
import { PaginationQueryDto } from 'src/pagination/dto/pagination-query.dto';
import { PaginatedResultDto } from 'src/pagination/dto/paginated-result.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
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
}
