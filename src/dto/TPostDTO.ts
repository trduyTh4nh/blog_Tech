import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TUserDTO } from "./TUserDTO";
import { TImageDTO } from "./TImageDTO";
import { TPostSectionDTO } from "./TPostSectionDTO";

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

  @Field(() => [TPostSectionDTO], { nullable: true })
  sections?: TPostSectionDTO[];
}

@InputType("TPostInputF")
export class TPostInputDTO {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => String)
  userId: string;

  @Field(() => [String], { nullable: true })
  imageIds?: string[];
  // chỗ này nhớ call api tạo hình ảnh rồi lấy id ảnh save vào đây
  @Field(() => [TPostSectionDTO], { nullable: true })
  sections?: TPostSectionDTO[];
}
