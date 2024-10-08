import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../../entities/tpost";
import { PostService } from "./post.service";
import { PostResolver } from "../post/post.resolver";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
  providers: [PostService, PostResolver],
})
export class PostModule {}
