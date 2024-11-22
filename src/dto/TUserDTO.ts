import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostDTO, TPostInputDTO } from "./TPostDTO";

@ObjectType()
export class TUserDTO {
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

  @Field(() => [TPostDTO], { nullable: true })
  posts?: TPostDTO[];

  @Field({ nullable: true })
  createdAt: Date;
}

@InputType()
export class TUserInputDTO {
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

  @Field(() => [TPostInputDTO], { nullable: true })
  posts?: TPostInputDTO[];
}
