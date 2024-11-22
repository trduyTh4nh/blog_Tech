import { Module } from "@nestjs/common";
import { PostImageService } from "./post-image.service";
import { PostImageController } from "./post-image.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPostSection } from "src/entities/tpost_section";

@Module({
  providers: [PostImageService],
  controllers: [PostImageController],
  imports: [TypeOrmModule.forFeature([TPostSection])],
})
export class PostImageModule {}
