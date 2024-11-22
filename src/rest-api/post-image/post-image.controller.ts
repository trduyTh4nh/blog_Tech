import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  Get,
} from "@nestjs/common";
import { PostImageService } from "./post-image.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/post-image")
export class PostImageController {
  constructor(private readonly postImageService: PostImageService) {}

  @Post("/addImageToPostSection")
  @UseInterceptors(FileInterceptor("file"))
  async addImageToPostSection(
    @UploadedFile() file: any,
    @Body("idPostSection") idPostSection: string
  ) {
    if (!idPostSection) {
      throw new NotFoundException("Not found idPostSection");
    }
    if (!file) {
      throw new BadRequestException("File is required");
    }

    return await this.postImageService.uploadImageForPostSection(
      idPostSection,
      file
    );
  }
}
