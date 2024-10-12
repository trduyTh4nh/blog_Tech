import { Resolver } from "@nestjs/graphql";
import { createGenericResolver } from "../generic/generic.resolver";
import { TPost } from "src/entities/tpost";
import { TPostDTO } from "src/dto/TPostDTO";

@Resolver()
export class PostResolver extends createGenericResolver<TPost>(
  TPostDTO,
  TPost
) {}
