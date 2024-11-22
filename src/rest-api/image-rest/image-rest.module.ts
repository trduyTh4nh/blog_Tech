import { Module } from "@nestjs/common";
import { ImageRestController } from "./image-rest.controller";
import { ImageRestService } from "./image-rest.service";
import { TImage } from "src/entities/timage";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TPost } from "src/entities/tpost";

@Module({
  imports: [TypeOrmModule.forFeature([TImage, TPost])],
  controllers: [ImageRestController],
  providers: [ImageRestService],
  exports: [ImageRestService],
})
export class ImageRestModule {}
