import { forwardRef, Module } from "@nestjs/common";
import { PostSectionListService } from "./post-section-list.service";
import { PostSectionListResolver } from "./post-section-list.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPostSectionList } from "src/entities/tpost_sections_list";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([TPostSectionList]),
    forwardRef(() => AuthModule),
  ],
  providers: [PostSectionListService, PostSectionListResolver],
  exports: [PostSectionListService, PostSectionListResolver],
})
export class PostSectionListModule {}
