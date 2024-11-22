import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostSectionDTO } from "./TPostSectionDTO";

@ObjectType()
export class TPostSectionParagraphDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  sectionId: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  image: string;

  @Field(() => TPostSectionDTO, { nullable: true })
  section: TPostSectionDTO;
}

@InputType()
export class TPostSectionParagraphInputDTO {
  @Field({ nullable: true })
  sectionId: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  image: string;
}
