import { UseGuards } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { Roles } from "src/auth/role/role.decorator";
import * as dotenv from "dotenv";
import { createGenericResolver } from "../generic/generic.resolver";
import { TPostSection } from "src/entities/tpost_section";
import { TPostSectionDTO } from "src/dto/TPostSectionDTO";
dotenv.config();

@Resolver()
@UseGuards(AuthGuard)
@Roles(process.env.USER_ROLE)
export class PostSectionResolver extends createGenericResolver<TPostSection>(
  TPostSectionDTO,
  TPostSection
) {}
