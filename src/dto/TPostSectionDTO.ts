import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostDTO } from "./TPostDTO";

import { TPostSectionTypeDTO } from "./TPostSectionTypeDTO";
import { TPostSectionListDTO } from "./TPostSectionListDTO";
import { TPostSectionCodeDTO } from "./TPostSectionCodeDTO";
import { TPostSectionParagraphDTO } from "./TPostSectionParagraphDTO";

// DTO cho TPostSection
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

  @Field(() => TPostSectionTypeDTO, { nullable: true })
  sectionType?: TPostSectionTypeDTO;

  @Field(() => [TPostSectionListDTO], { nullable: true })
  listItems?: TPostSectionListDTO[];

  @Field(() => [TPostSectionCodeDTO], { nullable: true })
  codeItems?: TPostSectionCodeDTO[];

  @Field(() => [TPostSectionParagraphDTO], { nullable: true })
  paragraphItems?: TPostSectionParagraphDTO[];
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

  @Field({ nullable: true })
  sectionTypeId: string;
}
