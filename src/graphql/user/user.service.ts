import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDTO } from "src/dto/TUserDTO";
import { UserInputDTO } from "src/dto/TUserDTO";
import { User } from "src/entities/t.user";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAllUser(): Promise<User[]> {
    return this.userRepository.find({
      relations: ["posts"],
    });
  }

  async findOneUser(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ["posts"] });
  }

  async signup(userDTO: UserInputDTO): Promise<User> {
    const newUser = this.userRepository.create({
      user_name: userDTO.userName,
      profile_picture: userDTO.profilePicture,
      bio: userDTO.bio,
      password: userDTO.password,
      email: userDTO.email,
      posts: userDTO.posts,
    });
    return this.userRepository.save(newUser);
  }
}
