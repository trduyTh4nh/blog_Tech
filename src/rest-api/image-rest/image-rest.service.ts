import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { TImageInputDTO, TImageRestInputDTO } from "src/dto/TImageDTO";
import { TImage } from "src/entities/timage";
import { TPost } from "src/entities/tpost";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class ImageRestService {
  constructor(
    @InjectRepository(TImage) private readonly repository: Repository<TImage>,
    @InjectRepository(TPost) private readonly postRepository: Repository<TPost>
  ) {}

  async createImage(image: TImageRestInputDTO): Promise<TImage> {
    const { description, postId, file } = image;

    const findPost = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!findPost) {
      throw new NotFoundException("Can not find post to create image");
    }
    // handle a module to upload image 
    // and remove image if you need remove it on bucket
    

    console.log("FILE to upload firebase: ", file);

    const newImage = this.repository.create({
      imageUrl: "doico.image.url",
      description: description,
      postId: findPost.id,
    });

    return await this.repository.save(newImage);
  }
}
