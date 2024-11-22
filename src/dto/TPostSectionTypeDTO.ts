import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { TPostSectionDTO } from "./TPostSectionDTO";

@ObjectType()
export class TPostSectionTypeDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => [TPostSectionDTO], { nullable: true })
  postSections: TPostSectionDTO[];
}

@InputType()
export class TPostSectionTypeInputDTO {
  @Field({ nullable: true })
  name: string;
}
