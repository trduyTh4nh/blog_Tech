import { forwardRef, Module } from "@nestjs/common";
import { PostSectionTypeService } from "./post-section-type.service";
import { PostSectionTypeResolver } from "./post-section-type.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPostSectionType } from "src/entities/tpost_sections_type";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([TPostSectionType]),
    forwardRef(() => AuthModule),
  ],
  providers: [PostSectionTypeService, PostSectionTypeResolver],
  exports: [TypeOrmModule, PostSectionTypeService],
})
export class PostSectionTypeModule {}
