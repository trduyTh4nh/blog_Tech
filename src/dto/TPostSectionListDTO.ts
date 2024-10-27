import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostSectionDTO } from "./TPostSectionDTO";

@ObjectType()
export class TPostSectionListDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  sectionId: string;

  @Field({ nullable: true })
  item: string;

  @Field({ nullable: true })
  image: string;

  @Field(() => TPostSectionDTO, { nullable: true })
  sections: TPostSectionDTO;
}

@InputType()
export class TPostSectionListInputDTO {
  @Field({ nullable: true })
  sectionId: string;

  @Field({ nullable: true })
  item: string;

  @Field({ nullable: true })
  image: string;
}
