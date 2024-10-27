import { forwardRef, Module } from "@nestjs/common";
import { PostSectionCodeService } from "./post-section-code.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPostSectionCode } from "src/entities/tpost_sections_code";
import { AuthModule } from "src/auth/auth.module";
import { PostSectionCodeResolver } from "./post-section-code.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([TPostSectionCode]),
    forwardRef(() => AuthModule),
  ],
  providers: [PostSectionCodeService, PostSectionCodeResolver],
  exports: [PostSectionCodeService, PostSectionCodeResolver],
})
export class PostSectionCodeModule {}
