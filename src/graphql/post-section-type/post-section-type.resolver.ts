import { Resolver } from "@nestjs/graphql";
import { createGenericResolver } from "../generic/generic.resolver";
import { TPostSectionType } from "src/entities/tpost_sections_type";
import { TPostSectionTypeDTO } from "src/dto/TPostSectionTypeDTO";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guard/auth.guard";
import * as dotenv from "dotenv";
import { Roles } from "src/auth/role/role.decorator";
dotenv.config();

@Resolver()
@UseGuards(AuthGuard)
@Roles(process.env.USER_ROLE)
export class PostSectionTypeResolver extends createGenericResolver<TPostSectionType>(
  TPostSectionTypeDTO,
  TPostSectionType
) {}
