import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TUserDTO } from "./TUserDTO";
import { TImageDTO } from "./TImageDTO";

@ObjectType()
export class TPostDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field(() => TUserDTO, { nullable: true })
  user?: TUserDTO;

  @Field(() => [TImageDTO], { nullable: true })
  images?: TImageDTO[];
}

@InputType()
export class TPostInputDTO {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => String, { nullable: true })
  userId: string;

  @Field(() => [String], { nullable: true })
  imageIds?: string[];
  // chỗ này nhớ call api tạo hình ảnh rồi lấy id ảnh save vào đây
}
