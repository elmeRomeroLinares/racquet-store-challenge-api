import { Field, ObjectType } from '@nestjs/graphql';
import { ProductDTO } from './product.dto';

@ObjectType()
export class LikeProductResponseDto {
  @Field(() => [ProductDTO])
  likedProductsByUser: ProductDTO[];
}
