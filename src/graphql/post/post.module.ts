import { Module } from "@nestjs/common";
import { PostResolver } from "./post.resolver";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPost } from "src/entities/tpost";

@Module({
  imports: [TypeOrmModule.forFeature([TPost])],
  exports: [TypeOrmModule],
  providers: [PostResolver, PostService],
})
export class PostModule {}
