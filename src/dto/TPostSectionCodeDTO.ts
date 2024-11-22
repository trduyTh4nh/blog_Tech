import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostSectionDTO } from "./TPostSectionDTO";

@ObjectType()
export class TPostSectionCodeDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  sectionId: string;

  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  language: string;

  @Field({ nullable: true })
  image: string;

  @Field(() => TPostSectionDTO, { nullable: true })
  section: TPostSectionDTO;
}

@InputType()
export class TPostSectionCodeInputDTO {
  @Field({ nullable: true })
  sectionId: string;

  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  language: string;

  @Field({ nullable: true })
  image: string;
}
