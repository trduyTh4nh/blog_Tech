import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserDTO } from './TUserDTO';

@ObjectType()
export class PostDTO {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  date: Date;

  @Field(() => UserDTO, { nullable: true })
  user?: UserDTO;
}


@InputType()
export class PostInputDTO {
  @Field()
  title: string

  @Field()
  content: string

  @Field(() => String, { nullable: true })
  userId: string
}