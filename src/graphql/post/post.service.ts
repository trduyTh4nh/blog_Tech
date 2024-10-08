import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostDTO, PostInputDTO } from "src/dto/TPostDTO";
import { User } from "src/entities/t.user";
import { Post } from "src/entities/tpost";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAllPost(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findOnePost(id: string): Promise<Post> {
    return await this.postRepository.findOne({ where: { id } });
  }

  async createPost(postDTO: PostInputDTO): Promise<Post> {
    const newPost = await this.postRepository.create(postDTO);
    newPost.date = new Date();
    const user: User = await this.userRepository.findOne({
      where: { id: newPost.userId },
    });
    newPost.user = user;
    return this.postRepository.save(newPost);
  }
}
