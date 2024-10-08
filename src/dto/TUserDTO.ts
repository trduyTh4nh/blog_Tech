import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PostDTO, PostInputDTO } from "./TPostDTO";

@ObjectType()
export class UserDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  userName: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  profilePicture: string;

  @Field(() => [PostDTO], { nullable: true })
  posts?: PostDTO[];
}

@InputType()
export class UserInputDTO {
  @Field()
  userName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  bio: string;

  @Field()
  profilePicture: string;

  @Field(() => [PostInputDTO], { nullable: true })
  posts?: PostInputDTO[];
}
