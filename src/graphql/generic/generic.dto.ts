import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenericDTO {
  @Field({ nullable: true })
  id: string;
}
