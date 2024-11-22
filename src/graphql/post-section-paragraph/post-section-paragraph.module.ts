import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { TPostSectionParagraph } from "src/entities/tpost_sections_paragraph";
import { PostSectionParagraphService } from "./post-section-paragraph.service";
import { PostSectionParagraphResolver } from "./post-section-paragraph.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([TPostSectionParagraph]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule, PostSectionParagraphService],
  providers: [PostSectionParagraphResolver, PostSectionParagraphService],
})
export class PostSectionParagraphModule {}
