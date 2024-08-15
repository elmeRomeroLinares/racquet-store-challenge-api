import { Field, ObjectType, Int } from '@nestjs/graphql';

export function GraphQlPaginatedResult<T>(
  classRef: new () => T,
  name: string,
): any {
  @ObjectType(`${name}PaginatedResult`)
  abstract class PaginatedResultType {
    @Field(() => [classRef], { nullable: true })
    data: T[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
  }
  return PaginatedResultType;
}
