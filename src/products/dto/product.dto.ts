import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductDTO {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  disabled: boolean;

  @Field()
  createdAt: Date;

  @Field()
  modifiedAt: Date;

  @Field()
  categoryId: string;

  @Field(() => Int)
  inventoryLevel: number;
}
