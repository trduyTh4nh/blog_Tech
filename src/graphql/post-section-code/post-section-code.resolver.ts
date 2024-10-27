import { Resolver } from "@nestjs/graphql";
import { createGenericResolver } from "../generic/generic.resolver";
import { TPostSectionCode } from "src/entities/tpost_sections_code";
import { TPostSectionCodeDTO } from "src/dto/TPostSectionCodeDTO";
import { UseGuards } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { Roles } from "src/auth/role/role.decorator";
import * as dotenv from "dotenv";
dotenv.config();

@Resolver()
@UseGuards(AuthModule)
@Roles(process.env.USER_ROLE)
export class PostSectionCodeResolver extends createGenericResolver<TPostSectionCode>(
  TPostSectionCodeDTO,
  TPostSectionCode
) {}
