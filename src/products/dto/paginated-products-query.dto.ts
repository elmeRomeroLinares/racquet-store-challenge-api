import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '@src/pagination/dto/pagination-query.dto';

export class PaginatedProductsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
