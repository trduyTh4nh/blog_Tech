import { forwardRef, Module } from "@nestjs/common";
import { PostSectionService } from "./post-section.service";
import { PostSectionResolver } from "./post-section.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPostSection } from "src/entities/tpost_section";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([TPostSection]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule, PostSectionService],
  providers: [PostSectionService, PostSectionResolver],
})
export class PostSectionModule {}
