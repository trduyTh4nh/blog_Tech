import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostDTO } from "./TPostDTO";

// section cho bài post
@ObjectType()
export class TPostSectionDTO {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  postId: string;
  @Field({ nullable: true })
  order: number;
  @Field({ nullable: true })
  header: string;
  @Field({ nullable: true })
  content: string;
  @Field({ nullable: true })
  imageUrl: string;
  @Field({ nullable: true })
  type: string;
  @Field(() => TPostDTO, { nullable: true })
  post?: TPostDTO;
}

@InputType()
export class TPostSectionInputDTO {
  @Field({ nullable: true })
  postId: string;
  @Field({ nullable: true })
  order: number;
  @Field({ nullable: true })
  header: string;
  @Field({ nullable: true })
  content: string;
  @Field({ nullable: true })
  imageUrl: string;
  @Field({ nullable: true })
  type: string;
}
