import { Resolver } from "@nestjs/graphql";
import { createGenericResolver } from "../generic/generic.resolver";
import { TPostSectionList } from "src/entities/tpost_sections_list";
import { TPostSectionListDTO } from "src/dto/TPostSectionListDTO";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guard/auth.guard";
import * as dotenv from "dotenv";
import { Roles } from "src/auth/role/role.decorator";
dotenv.config();

@Resolver()
@UseGuards(AuthGuard)
@Roles(process.env.USER_ROLE)
export class PostSectionListResolver extends createGenericResolver<TPostSectionList>(
  TPostSectionListDTO,
  TPostSectionList
) {}
