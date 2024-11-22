import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { createGenericResolver } from "../generic/generic.resolver";
import { TPost } from "src/entities/tpost";
import { TPostDTO, TPostInputDTO } from "src/dto/TPostDTO";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { Roles } from "src/auth/role/role.decorator";
import * as dotenv from "dotenv";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TUser } from "src/entities/tuser";
import { userInfo } from "os";
import { TImage } from "src/entities/timage";
dotenv.config();

@Resolver()
@UseGuards(AuthGuard)
@Roles(process.env.USER_ROLE)
export class PostResolver extends createGenericResolver<TPost>(
  TPostDTO,
  TPost
) {
  constructor(
    @InjectRepository(TPost) private postRepository: Repository<TPost>,
    @InjectRepository(TUser) private userRepository: Repository<TUser>,
    @InjectRepository(TImage) private imageRepository: Repository<TImage>
  ) {
    super(postRepository);
  }

  // @Mutation(() => TPostDTO)
  // async createPostF(@Args("input") input: TPostInputDTO): Promise<TPostDTO> {
  //   // check user
  //   const user = await this.userRepository.findOne({
  //     where: { id: input.userId },
  //   });

  //   if (!user) {
  //     throw new Error("User not found!");
  //   }

  //   let images = [];

  //   // mốt sẽ upload image ở đây sau đó dùng repo image tạo image sao đó lấy id image đó save vào repoImage

  //   // trước mắt là handle theo cách này

  //   if (input.imageIds && input.imageIds.length > 0) {
  //     images = await this.imageRepository.findByIds(input.imageIds);
  //   }
  //   const newPost = await this.postRepository.create({
  //     title: input.title,
  //     content: input.content,
  //     user: user,
  //     images: images,

  //   });

  //   await this.postRepository.save(newPost);

  //   return newPost;
  // }
}
