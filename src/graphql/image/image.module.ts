import { Module } from "@nestjs/common";
import { ImageResolver } from "./image.resolver";
import { ImageService } from "./image.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TImage } from "src/entities/timage";

@Module({
  imports: [TypeOrmModule.forFeature([TImage])],
  exports: [TypeOrmModule],
  providers: [ImageResolver, ImageService],
})
export class ImageModule {}
