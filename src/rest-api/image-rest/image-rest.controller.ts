import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { TImageRestInputDTO } from "src/dto/TImageDTO";
import { ImageRestService } from "./image-rest.service";

@Controller("image-rest")
export class ImageRestController {
  constructor(private readonly imageService: ImageRestService) {}

  @Post("createImage")
  @UseInterceptors(FileInterceptor("image"))
  async createImage(
    @UploadedFile() file: any,
    @Body() body: TImageRestInputDTO
  ) {
    const image: TImageRestInputDTO = body;
    image.file = file;
    return this.imageService.createImage(image);
  }
  @Get("hello")
  async Hello() {
    return {
      message: "hello!",
    };
  }
}
