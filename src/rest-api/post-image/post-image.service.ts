import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TPostSection } from "src/entities/tpost_section";
import { Repository } from "typeorm";
import { FirebaseService } from "../firebase/firebase.service";

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(TPostSection)
    private readonly repository: Repository<TPostSection>,
    private readonly firebaseService: FirebaseService
  ) {}

  async uploadImageForPostSection(idPostSection: string, file: any) {
    try {
      const findPostSection = await this.repository.findOne({
        where: { id: idPostSection },
      });

      if (!findPostSection) {
        throw new NotFoundException("Not found post section to update!");
      }
      const uploadImage = await this.firebaseService.uploadImage(file);
      findPostSection.imageUrl = uploadImage.url;
      return await this.repository.save(findPostSection);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }

  async deleteImageForPostSection(idPostSection: string, fileName: any) {
    try {
      const findPostSection = await this.repository.findOne({
        where: { id: idPostSection },
      });

      if (!findPostSection) {
        throw new NotFoundException("Not found post section to remove image!");
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }
}
