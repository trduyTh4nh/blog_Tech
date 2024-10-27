import { Resolver } from "@nestjs/graphql";
import { TPostSectionParagraph } from "src/entities/tpost_sections_paragraph";
import { TPostSectionParagraphDTO } from "src/dto/TPostSectionParagraphDTO";
import { createGenericResolver } from "../generic/generic.resolver";
import { UseGuards } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { Roles } from "src/auth/role/role.decorator";
import * as dotenv from "dotenv";
dotenv.config();

@Resolver()
@UseGuards(AuthModule)
@Roles(process.env.USER_ROLE)
export class PostSectionParagraphResolver extends createGenericResolver<TPostSectionParagraph>(
  TPostSectionParagraphDTO,
  TPostSectionParagraph
) {}
