import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class StringFilter {
  @Field({ nullable: true })
  equals?: string;

  @Field({ nullable: true })
  isNull?: boolean;

  @Field({ nullable: true })
  not?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];

  @Field({ nullable: true })
  lt?: string;

  @Field({ nullable: true })
  lte?: string;

  @Field({ nullable: true })
  gt?: string;

  @Field({ nullable: true })
  gte?: string;

  @Field({ nullable: true })
  contains?: string;

  @Field({ nullable: true })
  startsWith?: string;

  @Field({ nullable: true })
  endsWith?: string;
}

@InputType()
export class NumberFilter {
  @Field({ nullable: true })
  equals?: number;

  @Field({ nullable: true })
  not?: number;

  @Field(() => [Number], { nullable: true })
  in?: number[];

  @Field(() => [Number], { nullable: true })
  notIn?: number[];

  @Field({ nullable: true })
  lt?: number;

  @Field({ nullable: true })
  lte?: number;

  @Field({ nullable: true })
  gt?: number;

  @Field({ nullable: true })
  gte?: number;
}

@InputType()
export class BooleanFilter {
  @Field({ nullable: true })
  equals?: boolean;

  @Field({ nullable: true })
  not?: boolean;
}

@InputType()
export class DateFilter {
  @Field({ nullable: true })
  equals?: Date;

  @Field({ nullable: true })
  not?: Date;

  @Field(() => [Date], { nullable: true })
  in?: Date[];

  @Field(() => [Date], { nullable: true })
  notIn?: Date[];

  @Field({ nullable: true })
  lt?: Date;

  @Field({ nullable: true })
  lte?: Date;

  @Field({ nullable: true })
  gt?: Date;

  @Field({ nullable: true })
  gte?: Date;
}

// @InputType()
// export class WhereInput {
//   @Field(() => [WhereInput], { nullable: true })
//   AND?: WhereInput[];

//   @Field(() => [WhereInput], { nullable: true })
//   OR?: WhereInput[];

//   @Field(() => [WhereInput], { nullable: true })
//   NOT?: WhereInput[];

//   // Add fields for other properties as needed
// }

@ObjectType()
export class BaseResponse {
  @Field({ nullable: true })
  success: boolean;
  @Field({ nullable: true })
  code: string;
  @Field({ nullable: true })
  message: string;
}
