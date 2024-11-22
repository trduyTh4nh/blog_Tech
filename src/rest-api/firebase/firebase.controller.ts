import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("/firebase")
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post("/uploadImage")
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@UploadedFile() file: any) {
    return this.firebaseService.uploadImage(file);
  }

  @Post("/deleteImage")
  async deleteImage(@Body("fileName") fileName: string) {
    return this.firebaseService.deleteImage(fileName);
  }
}
