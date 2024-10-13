import { forwardRef, Module } from "@nestjs/common";
import { PostResolver } from "./post.resolver";
import { PostService } from "./post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPost } from "src/entities/tpost";
import { AuthModule } from "src/auth/auth.module";
import { TUser } from "src/entities/tuser";
import { TImage } from "src/entities/timage";

@Module({
  imports: [
    TypeOrmModule.forFeature([TPost, TUser, TImage]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule],
  providers: [PostResolver, PostService],
})
export class PostModule {}
