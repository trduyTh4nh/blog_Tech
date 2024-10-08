import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { PostDTO, PostInputDTO } from "../../dto/TPostDTO";
import { Post } from "src/entities/tpost";
import { convertPostEntityToDTO } from "src/utils/convert.func";

@Resolver(() => PostDTO)
export class PostResolver {
  constructor(private PostService: PostService) {}

  @Query(() => [PostDTO])
  async getAllPost(): Promise<Post[]> {
    return await this.PostService.findAllPost();
  }

  @Query(() => PostDTO, { nullable: true })
  async getPost(
    @Args("id", { type: () => String }) id: string
  ): Promise<PostDTO> {
    const post = await this.PostService.findOnePost(id);
    console.log(post);
    return convertPostEntityToDTO(post);
  }

  @Mutation(() => PostDTO)
  async createAPost(
    @Args("postInputDTO") postDTO: PostInputDTO
  ): Promise<PostDTO> {
    const post = await this.PostService.createPost(postDTO);
    return convertPostEntityToDTO(post);
  }
}
