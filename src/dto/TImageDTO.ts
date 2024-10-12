import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostDTO } from "./TPostDTO";

@ObjectType()
export class TImageDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  imageUrl: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field(() => TPostDTO, { nullable: true })
  post?: TPostDTO;
}

@InputType()
export class TImageInputDTO {
  @Field()
  imageUrl: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  postId: string;
}
